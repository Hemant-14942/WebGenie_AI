"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageSquareText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/Reveal";

const contactChannels = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@webgenie.ai",
    hint: "For support, partnership, and billing questions",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+91 98765 43210",
    hint: "Mon to Fri, 10:00 AM to 6:00 PM IST",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Bengaluru, India",
    hint: "Remote-first team with India headquarters",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-green/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 -left-10 h-72 w-72 rounded-full bg-green/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
            <MessageSquareText className="size-3.5 text-green" aria-hidden />
            Contact WebGenie AI
          </p>
        </Reveal>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div>
              <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-tight tracking-tight">
                Let&apos;s build something premium together.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
                Whether you need product guidance, enterprise onboarding, or
                dedicated support, our team is ready to help you launch faster with
                WebGenie AI.
              </p>

              <div className="mt-8 grid gap-3">
                {contactChannels.map((channel, index) => {
                  const Icon = channel.icon;
                  return (
                    <Reveal key={channel.label} delay={0.1 + index * 0.06}>
                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start gap-3">
                          <div className="inline-flex rounded-xl border border-green/30 bg-green/10 p-2">
                            <Icon className="size-4 text-green" aria-hidden />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{channel.label}</p>
                            <p className="mt-1 text-sm text-white/85">{channel.value}</p>
                            <p className="mt-1 text-xs text-white/55">{channel.hint}</p>
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-7">
              <h2 className="text-xl font-semibold tracking-tight">Send us a message</h2>
              <p className="mt-2 text-sm text-white/60">
                Fill this form and our team will get back to you shortly.
              </p>

              <form className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs text-white/60">First name</span>
                    <input
                      type="text"
                      placeholder="John"
                      className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-green/50 focus:ring-2 focus:ring-green/20"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs text-white/60">Last name</span>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-green/50 focus:ring-2 focus:ring-green/20"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-xs text-white/60">Work email</span>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-green/50 focus:ring-2 focus:ring-green/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs text-white/60">How can we help?</span>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your requirement..."
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-green/50 focus:ring-2 focus:ring-green/20"
                  />
                </label>

                <Button
                  type="button"
                  className="h-11 w-full rounded-xl bg-green font-semibold text-black hover:brightness-95"
                >
                  Send message
                </Button>

                <p className="text-center text-xs text-white/45">
                  Need instant access?{" "}
                  <Link href="/generate" className="text-green underline underline-offset-4">
                    Start building now
                  </Link>
                  .
                </p>
              </form>
            </section>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Looking for enterprise support?
                </p>
                <p className="mt-1 text-xs text-white/55">
                  Get custom onboarding, dedicated support, and workflow consulting.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5"
              >
                <Link href="/about">
                  Learn about us
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
