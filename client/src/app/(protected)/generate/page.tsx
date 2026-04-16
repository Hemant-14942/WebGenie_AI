"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { serverUrl } from "@/helpers/constants";
import { useAppDispatch } from "@/store/hooks";
import { updateCredits } from "@/store/features/auth/authSlice";

const MIN_PROMPT_LENGTH = 20;

const MAX_PROMPT_LENGTH = 8000;

const GENERATION_STEPS = [
  "Understanding your prompt...",
  "Designing layout structure...",
  "Crafting sections and copy...",
  "Refining responsive behavior...",
  "Polishing final output...",
];


export default function GeneratePage() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const trimmed = prompt.trim();
  const canSubmit =
    isAuthenticated &&
    trimmed.length >= MIN_PROMPT_LENGTH &&
    !isSubmitting &&
    (user?.credits ?? 0) > 0;

  useEffect(() => {
    if (!isSubmitting) return;

    const progressTimer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const delta = Math.max(1, Math.floor((100 - prev) / 100));
        return Math.min(92, prev + delta);
      });
    }, 820);

    const stepTimer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % GENERATION_STEPS.length);
    }, 1800);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(stepTimer);
    };
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("inside handleSubmit");
    if (!canSubmit) return;
    setError(null);
    setProgress(6);
    setStepIndex(0);
    setIsSubmitting(true);
    let shouldResetLoading = true;
    try {
      console.log("inside try going for api cal fro build website");
      const res = await axios.post(
        `${serverUrl}/api/build-website`,
        { prompt: trimmed },
        { withCredentials: true }
      );
      const websiteId = res.data.websiteId;
      if(!websiteId){
        setError("Failed to create website. Please try again.");
        return;
      }
      if (typeof res.data.credits === "number") {
        dispatch(updateCredits(res.data.credits));
      }
      setProgress(100);
      setStepIndex(GENERATION_STEPS.length - 1);
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      shouldResetLoading = false;
      router.push(`/builder/${websiteId}`);
    } catch (error) {
      console.error(error);
      setError((error as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      if (shouldResetLoading) {
        setIsSubmitting(false);
        setProgress(0);
      }
    }
  };

  if (!isAuthenticated || !user?.email) {
    return (
      <main className="min-h-screen bg-black px-5 pb-20 pt-24 text-white md:px-8 md:pt-28">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to generate
          </h1>
          <p className="mt-3 text-sm text-white/60">
            You need an account to create websites with AI and use credits.
          </p>
          <Button
            asChild
            className="mt-8 h-11 rounded-full bg-white px-8 font-semibold text-black hover:bg-white/90"
          >
            <Link href="/login">Go to login</Link>
          </Button>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white/80"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if ((user.credits ?? 0) <= 0) {
    return (
      <main className="min-h-screen bg-black px-5 pb-20 pt-24 text-white md:px-8 md:pt-28">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-semibold tracking-tight">No credits left</h1>
          <p className="mt-3 text-sm text-white/60">
            Add credits or upgrade your plan to keep building.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-8 rounded-full border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-20 md:px-8 md:pt-24">

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
            Build websites with real AI power
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50 md:text-base">
            This process may take several minutes. WebGenie AI focuses on quality,
            not shortcuts.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-2xl md:mt-14"
        >
          <label
            htmlFor="website-prompt"
            className="mb-3 block text-left text-sm font-medium text-white"
          >
            Describe your website
          </label>
          <textarea
            id="website-prompt"
            name="prompt"
            rows={10}
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH))
            }
            placeholder="Describe your website in detail — audience, sections, style, colors, and any must-have features…"
            className="w-full resize-y rounded-2xl border border-white/15 bg-black/40 px-4 py-4 text-[15px] leading-relaxed text-white placeholder:text-white/35 outline-none transition focus:border-green/50 focus:ring-2 focus:ring-green/20"
            disabled={isSubmitting}
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
            <span>
              {trimmed.length < MIN_PROMPT_LENGTH
                ? `At least ${MIN_PROMPT_LENGTH} characters (${Math.max(0, MIN_PROMPT_LENGTH - trimmed.length)} more)`
                : "Ready to generate"}
            </span>
            <span>
              {trimmed.length} / {MAX_PROMPT_LENGTH}
            </span>
          </div>

          {error ? (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          {isSubmitting ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-white/70">
                <p className="font-medium text-green">{GENERATION_STEPS[stepIndex]}</p>
                <p className="tabular-nums">{progress}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-green/90 via-[#d8ff3f] to-green transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              disabled={!canSubmit}
              className={`h-12 min-w-[200px] cursor-pointer rounded-xl px-10 text-base font-semibold shadow-lg shadow-black/30 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                canSubmit
                  ? "bg-green text-black hover:brightness-95"
                  : "bg-white/15 text-white/60"
              }`}
            >
              {isSubmitting ? "Starting…" : "Generate website"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
