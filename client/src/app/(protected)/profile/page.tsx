"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Coins,
  Crown,
  LayoutTemplate,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { serverUrl } from "@/helpers/constants";
import { useAppSelector } from "@/store/hooks";

type WebsiteItem = {
  _id: string;
  title?: string;
  code?: string;
  deployed?: boolean;
  updatedAt?: string;
  deployedUrl?: string;
  conversation?: { role: "user" | "ai"; content: string }[];
};

const formatDate = (value?: string) => {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export default function ProfilePage() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWebsites = useCallback(async () => {
    if (!isAuthenticated || !user?.email) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${serverUrl}/api/websites`, {
        withCredentials: true,
      });
      const websiteList = Array.isArray(res.data?.websites)
        ? res.data.websites
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      setWebsites(websiteList);
    } catch (err) {
      console.error(err);
      setError("Failed to load websites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }, [user?.name]);

  if (!isAuthenticated || !user?.email) {
    return (
      <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white md:px-8">
        <p className="text-white/70">Please sign in to view your profile.</p>
        <Button
          asChild
          className="mt-4 rounded-full bg-white text-black hover:bg-white/90"
        >
          <Link href="/login">Go to login</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-24 text-white md:px-8 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Your Profile
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Manage your projects, continue edits, and launch something new.
            </p>
          </div>
          <Button
            asChild
            className="h-10 rounded-full bg-green px-5 text-black hover:brightness-95"
          >
            <Link href="/generate">
              <Plus className="size-4" aria-hidden />
              New Website
            </Link>
          </Button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/45">Plan</p>
            <div className="mt-3 flex items-center gap-2">
              <Crown className="size-4 text-green" aria-hidden />
              <p className="text-lg font-semibold capitalize">
                {user.plans ?? "free"}
              </p>
            </div>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/45">Credits</p>
            <div className="mt-3 flex items-center gap-2">
              <Coins className="size-4 text-green" aria-hidden />
              <p className="text-lg font-semibold">{user.credits ?? 0}</p>
            </div>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/45">Websites</p>
            <div className="mt-3 flex items-center gap-2">
              <LayoutTemplate className="size-4 text-green" aria-hidden />
              <p className="text-lg font-semibold">{websites.length}</p>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 font-semibold text-white">
              {initials}
            </div>
            <div>
              <p className="text-sm text-white/50">Signed in as</p>
              <p className="font-medium">{user.name ?? "No name set"}</p>
              <p className="text-sm text-white/70">{user.email}</p>
            </div>
            <div className="ml-auto rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/65">
              <UserRound className="mr-1 inline size-3.5" aria-hidden />
              Account
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            {!isLoading && websites.length > 0 ? (
              <p className="text-xs text-white/45">
                {websites.length} saved{" "}
                {websites.length === 1 ? "website" : "websites"}
              </p>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <p className="text-sm text-red-200">{error}</p>
              <Button
                variant="outline"
                className="mt-4 border-white/20"
                onClick={loadWebsites}
              >
                Retry
              </Button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && !error && websites.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <Sparkles className="mx-auto size-6 text-green" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">No websites yet</h3>
              <p className="mt-2 text-sm text-white/55">
                Start your first project with a prompt and continue refining it
                with AI.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-green px-5 text-black"
              >
                <Link href="/generate">
                  <Plus className="size-4" aria-hidden />
                  Create first website
                </Link>
              </Button>
            </div>
          ) : null}

          {!isLoading && !error && websites.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {websites.map((website) => (
                <article
                  key={website._id}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-green/40 hover:bg-white/[0.07]"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                    {website.code?.trim() ? (
                      <iframe
                        title={`${website.title ?? "Website"} preview`}
                        className="pointer-events-none absolute left-0 top-0 h-[720px] w-[1280px] origin-top-left scale-[0.34] border-0 bg-white"
                        sandbox="allow-same-origin allow-scripts"
                        srcDoc={website.code}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-white/45">
                        Preview unavailable
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-base font-semibold text-white">
                      {website.title?.trim() || "Untitled website"}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        website.deployed
                          ? "bg-green/20 text-green"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {website.deployed ? "Live" : "Draft"}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-white/45">
                    Last edited {formatDate(website.updatedAt)}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {website.conversation?.length ?? 0} messages in chat history
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      href={`/builder/${website._id}`}
                      className="inline-flex text-xs font-medium text-green transition group-hover:translate-x-0.5"
                    >
                      Open in builder →
                    </Link>
                    {website.deployed && website.deployedUrl ? (
                      <a
                        href={new URL(website.deployedUrl).pathname}
                        className="inline-flex text-xs text-green underline underline-offset-4"
                      >
                        Open live site
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
