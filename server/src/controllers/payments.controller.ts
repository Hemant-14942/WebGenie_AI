import type { Request, Response } from "express";
import type { Request as CustomRequest } from "../types/http.js";
import Stripe from "stripe";
import { User } from "../models/user.model.js";
import { StripeProcessedEvent } from "../models/stripeProcessedEvent.model.js";

const DUPLICATE_KEY_CODE = 11_000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const CREDIT_PACKS: Record<string, { credits: number; amountInPaise: number }> = {
  pro: { credits: 500, amountInPaise: 49900 },         // INR 499.00
  enterprise: { credits: 3000, amountInPaise: 149900 } // INR 1499.00
};
type PlanKey = keyof typeof CREDIT_PACKS;

export const createCheckoutSession = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const requestedPlan = req.body?.plan;
    const plan: PlanKey =
      typeof requestedPlan === "string" && requestedPlan in CREDIT_PACKS
        ? (requestedPlan as PlanKey)
        : "pro";
    const selected = CREDIT_PACKS[plan];
    if (!selected) return res.status(400).json({ message: "Invalid plan" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `${selected.credits} Credits` },
            unit_amount: selected.amountInPaise,
          },
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL as string,
      cancel_url: process.env.STRIPE_CANCEL_URL as string,
      metadata: {
        userId,
        credits: String(selected.credits),
        plan,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || Array.isArray(signature)) {
    return res.status(400).json({ message: "Missing stripe-signature header" });
  }
  let event: Stripe.Event;
  try {
    // req.body must be RAW buffer here (not parsed JSON)
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ message: "Invalid webhook signature" });
  }
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const creditsRaw = session.metadata?.credits;
      const creditsToAdd = Number(creditsRaw ?? 0);
      const planRaw = session.metadata?.plan;
      const planIsPaid =
        planRaw === "pro" || planRaw === "enterprise";
      if (!userId || !Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
        return res.status(400).json({ message: "Invalid session metadata" });
      }
      if (!planIsPaid) {
        return res.status(400).json({ message: "Invalid or missing plan in session metadata" });
      }

      // Idempotency: Stripe may retry the same event. If we already processed this event.id, skip.
      try {
        await StripeProcessedEvent.create({
          stripeEventId: event.id,
          eventType: event.type,
        });
      } catch (err: unknown) {
        const code =
          err && typeof err === "object" && "code" in err
            ? (err as { code?: number }).code
            : undefined;
        if (code === DUPLICATE_KEY_CODE) {
          return res.status(200).json({ received: true, duplicate: true });
        }
        throw err;
      }

      try {
        await User.findByIdAndUpdate(userId, {
          $inc: { credits: creditsToAdd },
          $set: { plans: planRaw },
        });
      } catch (updateErr) {
        await StripeProcessedEvent.deleteOne({ stripeEventId: event.id }).catch(
          () => undefined,
        );
        throw updateErr;
      }
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};