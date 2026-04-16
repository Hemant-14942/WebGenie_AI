"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Sparkles,
  Trophy,
  Users2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/Reveal";

const milestones = [
  { label: "Websites generated", value: "12,000+" },
  { label: "Average build time", value: "< 3 min" },
  { label: "Creator satisfaction", value: "98%" },
];

const awards = [
  { title: "Best AI Product Experience 2026", org: "Design Forward Awards" },
  { title: "Top Developer Tool of the Year", org: "Builders Guild" },
  { title: "Innovation in Generative UX", org: "Future Interface Summit" },
];

const principles = [
  {
    icon: Sparkles,
    title: "Design-first intelligence",
    text: "Every generated site starts with clear hierarchy, conversion-driven layout, and polished visual rhythm.",
  },
  {
    icon: Zap,
    title: "Fast iteration loop",
    text: "Generate, review, and refine instantly with AI chat inside the builder workflow.",
  },
  {
    icon: Users2,
    title: "Built for real founders",
    text: "From freelancers to startups, WebGenie AI helps teams launch quality websites without design bottlenecks.",
  },
];

export default function About() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-green/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-green/10 blur-3xl" />

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
            <Trophy className="size-3.5 text-green" aria-hidden />
            Award-winning AI website builder
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <div>
                <h1 className="max-w-4xl text-[clamp(2rem,5vw,4rem)] font-semibold leading-tight tracking-tight">
                  We build websites that look crafted, not generated.
                </h1>
                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
                  WebGenie AI combines product design taste with reliable generation
                  workflows, helping creators launch premium websites from a single
                  prompt and refine them with real-time AI edits.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-green px-5 text-black hover:brightness-95"
                  >
                    <Link href="/generate">
                      Start building
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/20"
                  >
                    <Link href="/profile">View your workspace</Link>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold tracking-tight">Why teams trust us</h2>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <p className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 size-4 text-green" />
                    Production-ready HTML output built for speed.
                  </p>
                  <p className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 size-4 text-green" />
                    Fast edit loop with AI chat and instant preview.
                  </p>
                  <p className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 size-4 text-green" />
                    Design quality focused on real conversion outcomes.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {milestones.map((item, index) => (
              <Reveal key={item.label} delay={0.1 + index * 0.06}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-white/55">{item.label}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">Our story</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                We started WebGenie AI with one belief: launching a high-quality
                website should not require weeks of back-and-forth. Most tools
                generate something usable. We focused on making it feel intentional,
                conversion-ready, and production-minded.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Today, we help builders go from idea to live page quickly, with an
                editing experience that feels like working with a senior frontend
                partner.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">Recognition</h2>
              <div className="mt-5 space-y-3">
                {awards.map((award, index) => (
                  <Reveal key={award.title} delay={0.12 + index * 0.05}>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                      <div className="flex items-start gap-3">
                        <Award className="mt-0.5 size-4 text-green" aria-hidden />
                        <div>
                          <p className="text-sm font-medium text-white">{award.title}</p>
                          <p className="mt-1 text-xs text-white/55">{award.org}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">What makes us different</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.08 + index * 0.06}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Icon className="size-5 text-green" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}