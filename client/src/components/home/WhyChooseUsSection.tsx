import { Gauge, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const reasons = [
  {
    icon: Sparkles,
    title: "Design quality first",
    text: "Every generation is tuned for visual hierarchy, clean spacing, and premium modern styling.",
  },
  {
    icon: Gauge,
    title: "Fast iteration cycle",
    text: "Prompt, preview, and refine in minutes with AI chat directly connected to your website state.",
  },
  {
    icon: Layers3,
    title: "Production-ready output",
    text: "You get complete responsive HTML/CSS/JS output that is easy to inspect, edit, and deploy.",
  },
  {
    icon: ShieldCheck,
    title: "Built for reliability",
    text: "Structured generation flow with retries and validation keeps output stable for real-world use.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative py-8 md:py-12">
      <Reveal>
        <h2 className="text-center text-[clamp(1.7rem,4vw,2.6rem)] font-bold tracking-tight">
          Why choose WebGenie AI
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/60 md:text-base">
          A full-stack website builder experience designed for creators who care
          about quality, speed, and control.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
        {reasons.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <Reveal key={reason.title} delay={0.12 + index * 0.06}>
              <article className="rounded-2xl border border-white/10 bg-white/4 p-5 md:p-6">
                <div className="inline-flex rounded-xl border border-green/30 bg-green/10 p-2.5">
                  <Icon className="size-5 text-green" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {reason.text}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
