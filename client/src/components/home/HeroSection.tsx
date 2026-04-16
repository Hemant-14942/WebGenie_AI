import Link from "next/link";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
  return (
    <section className="flex min-h-[72vh] flex-col items-center justify-center">
      <Reveal>
        <p className="bg-linear-to-r from-green via-[#c8ef2a] to-green bg-clip-text text-center text-xs font-semibold uppercase tracking-[0.4em] text-transparent md:text-sm">
          WebGenie AI
        </p>
      </Reveal>
      <Reveal delay={0.07}>
        <h1 className="max-w-[18ch] text-center text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-white md:max-w-[22ch]">
          Turn your big idea into a stunning website
        </h1>
      </Reveal>

      <Reveal delay={0.14}>
        <p className="mt-5 max-w-xl text-center text-base leading-relaxed text-white/65 md:mt-6 md:text-lg">
          WebGenie AI turns your prompt into a polished website with smart
          layouts, clear copy, and launch-ready sections in minutes.
        </p>
      </Reveal>

      <Reveal
        delay={0.2}
        className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4"
      >
        <Button
          size="lg"
          className="h-11 rounded-full border-0 bg-green px-7 text-[0.95rem] font-semibold text-black shadow-none hover:bg-[#c8ef2a] md:h-12 md:px-8 md:text-base"
          asChild
        >
          <Link href="/generate">Generate a website</Link>
        </Button>
        <Button
          size="lg"
          className="h-11 rounded-full border-0 bg-white px-7 text-[0.95rem] font-semibold text-black shadow-none hover:bg-white/90 md:h-12 md:px-8 md:text-base"
          asChild
        >
          <Link href="#pricing">See pricing</Link>
        </Button>
      </Reveal>
    </section>
  );
}
