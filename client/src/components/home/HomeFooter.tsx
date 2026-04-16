import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function HomeFooter() {
  return (
    <footer className="border-t border-white/10 py-8 md:py-10">
      <Reveal className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <p className="bg-linear-to-r from-green via-[#c8ef2a] to-green bg-clip-text text-sm font-semibold tracking-wide text-transparent">
            WebGenie AI
          </p>
          <p className="mt-1 text-xs text-white/55">
            Build beautiful websites with AI.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/65 md:text-sm">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
          <Link href="/generate" className="transition hover:text-white">
            Generate
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Login
          </Link>
        </nav>
      </Reveal>
    </footer>
  );
}
