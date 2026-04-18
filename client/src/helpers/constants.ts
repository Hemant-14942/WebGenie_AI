export const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/** Used if you add Stripe.js / Payment Element later; Checkout redirect does not need it. */
export const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";