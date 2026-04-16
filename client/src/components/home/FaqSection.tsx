import Reveal from "@/components/ui/Reveal";

const faqItems = [
  {
    question: "How does WebGenie AI generate websites?",
    answer:
      "You provide a prompt, WebGenie AI generates full HTML/CSS/JS, and you can refine it instantly through the builder chat.",
  },
  {
    question: "Do I get editable source code?",
    answer:
      "Yes. You can view the generated code directly in the builder, copy it, and continue customizing as needed.",
  },
  {
    question: "Is the output responsive for mobile and tablet?",
    answer:
      "WebGenie AI generation is designed to produce responsive layouts with mobile, tablet, and desktop compatibility.",
  },
  {
    question: "How does credit-based pricing work?",
    answer:
      "You purchase credits once and spend credits per generation or chat update. Your remaining credits are visible in-app.",
  },
];

export default function FaqSection() {
  return (
    <section className="relative py-10 md:py-14">
      <Reveal>
        <h2 className="text-center text-[clamp(1.7rem,4vw,2.6rem)] font-bold tracking-tight">
          Frequently asked questions
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/60 md:text-base">
          Everything you need to know before you build and launch with
          WebGenie AI.
        </p>
      </Reveal>

      <div className="mx-auto mt-8 max-w-4xl space-y-3 md:mt-10">
        {faqItems.map((item, index) => (
          <Reveal key={item.question} delay={0.12 + index * 0.05}>
            <details className="group rounded-2xl border border-white/10 bg-white/4 p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white marker:content-none md:text-base">
                <div className="flex items-center justify-between gap-3">
                  <span>{item.question}</span>
                  <span className="text-white/60 transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
