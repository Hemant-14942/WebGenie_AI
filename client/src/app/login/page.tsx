"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { Button } from "@/components/ui/button";
import { serverUrl } from "@/helpers/constants";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/store/features/auth/authSlice";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/";
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) return decoded;
  } catch {
    /* ignore */
  }
  return "/";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    dispatch(signInStart());
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(
        signInSuccess({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          credits: response.data.user.credits ?? null,
          plans: response.data.user.plans ?? null,
        }),
      );
      const next = safeNextPath(searchParams.get("next"));
      router.push(next);
    } catch {
      dispatch(signInFailure("Google sign-in failed. Please try again."));
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mb-6 flex items-center justify-center gap-3 text-sm font-semibold text-white">
        <span
          className="inline-flex size-2 rounded-full bg-green shadow-[0_0_12px_var(--color-green)]"
          aria-hidden
        />
        <span className="bg-linear-to-r from-green via-[#c8ef2a] to-green bg-clip-text text-base font-semibold tracking-wide text-transparent">
          WebGenie AI
        </span>
      </div>

      <h1 className="text-2xl font-semibold sm:text-3xl">Welcome back</h1>
      <p className="mt-3 text-sm text-white/70 sm:text-base">
        Sign in with Google to start building your AI-powered website.
      </p>

      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green text-base font-semibold text-black transition hover:brightness-95"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className="size-5"
          viewBox="0 0 533.5 544.3"
        >
          <path
            fill="#4285F4"
            d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.3h146.9c-6.3 34.1-25 63-53.3 82.3v68h86.2c50.4-46.4 81.7-114.9 81.7-195.3z"
          />
          <path
            fill="#34A853"
            d="M272 544.3c72.6 0 133.6-24.1 178.1-65.4l-86.2-68c-23.9 16-54.4 25.4-91.9 25.4-70.7 0-130.6-47.7-152.1-111.9H32.1v70.3c44.1 87.2 134.4 149.6 239.9 149.6z"
          />
          <path
            fill="#FBBC05"
            d="M119.9 324.4c-10.8-32-10.8-66.5 0-98.5V155.6H32.1c-39.6 79-39.6 173.9 0 252.9l87.8-84.1z"
          />
          <path
            fill="#EA4335"
            d="M272 107.7c39.5-.6 77.4 14.2 106.3 41.2l79.1-79.1C413.5 24.5 344.6-1.3 272 0 166.5 0 76.2 62.4 32.1 149.6l87.8 76.3C141.4 155.4 201.3 107.7 272 107.7z"
          />
        </svg>
        <span>{isLoading ? "Signing you in..." : "Continue with Google"}</span>
      </Button>

      {error ? (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 pb-16 pt-28">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
