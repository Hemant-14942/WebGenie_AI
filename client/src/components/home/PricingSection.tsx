"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/Reveal";
import { StartCheckoutButton } from "@/components/payments/StartCheckoutButton";

const pricingPlans = [
  {
    name: "Free",
    tagline: "Perfect to explore WebGenie AI.",
    price: "Rs 0",
    cadence: "/one-time",
    credits: "100 Credits",
    features: [
      "AI website generation",
      "Responsive HTML output",
      "Basic animations",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    tagline: "For serious creators and freelancers.",
    price: "Rs 499",
    cadence: "/one-time",
    credits: "500 Credits",
    features: [
      "Everything in Free",
      "Faster generation",
      "Edit and regenerate",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    tagline: "For teams and power users.",
    price: "Rs 1499",
    cadence: "/one-time",
    credits: "3000 Credits",
    features: [
      "Unlimited iterations",
      "Highest priority",
      "Team collaboration",
      "Dedicated support",
    ],
    cta: "Buy Enterprise",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-8 md:py-12">
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-green/20 blur-3xl" />
      <div className="relative z-10">
        <Reveal>
          <h2 className="text-center text-[clamp(1.7rem,4vw,2.6rem)] font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-3 text-center text-sm text-white/60 md:text-base">
            Buy credits once. Build anytime.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.name} delay={0.12 + index * 0.06}>
              <article
                className={`rounded-2xl border p-5 backdrop-blur md:p-6 ${
                  plan.highlighted
                    ? "border-green/45 bg-linear-to-b from-green/20 to-black/70 shadow-[0_0_40px_rgba(180,255,44,0.2)]"
                    : "border-white/10 bg-white/4"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-xs text-white/55">{plan.tagline}</p>
                  </div>
                  {plan.highlighted ? (
                    <span className="rounded-full border border-green/40 bg-green/15 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-green">
                      Most Popular
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-end gap-1">
                  <p className="text-4xl font-bold tracking-tight">{plan.price}</p>
                  <p className="pb-1 text-xs text-white/55">{plan.cadence}</p>
                </div>

                <p className="mt-4 text-sm font-medium text-white/90">{plan.credits}</p>

                <ul className="mt-5 space-y-2.5 text-sm text-white/75">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 text-green">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === "Free" ? (
                  <Button
                    className="mt-8 h-10 w-full rounded-xl bg-white/10 font-semibold text-white hover:bg-white/20"
                    asChild
                  >
                    <Link href="/login">{plan.cta}</Link>
                  </Button>
                ) : plan.name === "Pro" ? (
                  <div className="mt-8">
                    <StartCheckoutButton
                      plan="pro"
                      className="bg-green text-black hover:bg-[#c8ef2a]"
                    >
                      {plan.cta}
                    </StartCheckoutButton>
                  </div>
                ) : (
                  <div className="mt-8">
                    <StartCheckoutButton
                      plan="enterprise"
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      {plan.cta}
                    </StartCheckoutButton>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
