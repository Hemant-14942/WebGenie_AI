"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { createCheckoutSession, type CheckoutPlan } from "@/lib/payments-api";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

type Props = {
  plan: CheckoutPlan;
  children: React.ReactNode;
  className?: string;
  /** When false, render as full-width block (e.g. pricing cards). */
  fullWidth?: boolean;
};

export function StartCheckoutButton({
  plan,
  children,
  className,
  fullWidth = true,
}: Props) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    if (!isAuthenticated) {
      const next = encodeURIComponent("/profile");
      router.push(`/login?next=${next}`);
      return;
    }
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(plan);
      if (url) {
        window.location.href = url;
        return;
      }
      setError("Checkout did not return a URL.");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/profile")}`);
        return;
      }
      setError("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <Button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(fullWidth && "h-10 w-full rounded-xl font-semibold", className)}
      >
        {loading ? "Redirecting…" : children}
      </Button>
      {error ? (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
