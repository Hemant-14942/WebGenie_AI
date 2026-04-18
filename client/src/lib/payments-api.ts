import axios from "axios";
import { serverUrl } from "@/helpers/constants";

export type CheckoutPlan = "pro" | "enterprise";

export async function createCheckoutSession(plan: CheckoutPlan) {
  const res = await axios.post<{ url?: string }>(
    `${serverUrl}/api/create-checkout-session`,
    { plan },
    { withCredentials: true },
  );
  return res.data;
}
