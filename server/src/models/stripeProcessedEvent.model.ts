import mongoose from "mongoose";

/**
 * One row per Stripe webhook event we have successfully applied.
 * Unique `stripeEventId` gives idempotency when Stripe retries the same delivery.
 */
const stripeProcessedEventSchema = new mongoose.Schema(
  {
    stripeEventId: { type: String, required: true, unique: true, index: true },
    /** Stripe event type, e.g. checkout.session.completed */
    eventType: { type: String, required: true },
  },
  { timestamps: true },
);

export const StripeProcessedEvent = mongoose.model(
  "StripeProcessedEvent",
  stripeProcessedEventSchema,
);
