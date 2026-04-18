import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white md:px-8">
      <div className="mx-auto max-w-md text-center">
        <XCircle
          className="mx-auto size-14 text-amber-400/90"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Checkout cancelled
        </h1>
        <p className="mt-3 text-sm text-white/60">
          No charge was made. You can try again anytime from pricing or your
          profile.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="rounded-full bg-green px-6 text-black hover:brightness-95"
          >
            <Link href="/profile">Back to profile</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/20 bg-transparent"
          >
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
