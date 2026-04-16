"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Code2, Copy, Eye, MessageSquareText, Rocket, X } from "lucide-react";
import axios from "axios";
import { serverUrl } from "@/helpers/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCredits } from "@/store/features/auth/authSlice";
import Editor from "@monaco-editor/react";
import * as prettier from "prettier/standalone";
import * as htmlPlugin from "prettier/plugins/html";

type Message = { role: "user" | "ai"; content: string };

function buildPreviewDoc(html: string): string {
  if (!html) return "";

  const guardScript = `<script>
    (function () {
      function getHashTarget(href) {
        try {
          var parsed = new URL(href, window.location.href);
          if (parsed.origin !== window.location.origin) return null;

          if (parsed.hash && parsed.hash !== "#") {
            return parsed.hash;
          }

          var normalizedPath = parsed.pathname.replace(/^\\/+|\\/+$/g, "");
          if (!normalizedPath) return null;
          var pieces = normalizedPath.split("/").filter(Boolean);
          var sectionId = pieces[pieces.length - 1];
          if (!sectionId) return null;
          return "#" + decodeURIComponent(sectionId);
        } catch {
          return null;
        }
      }

      function activatePageForElement(node) {
        if (!(node instanceof Element)) return;
        var pages = Array.from(document.querySelectorAll(".page"));
        if (pages.length === 0) return;
        for (var i = 0; i < pages.length; i++) {
          pages[i].classList.remove("active");
        }
        var page = node.closest(".page");
        if (page) page.classList.add("active");
      }

      function navigateInsidePreview(hash) {
        var id = hash.replace(/^#/, "");
        if (!id) return;

        var target =
          document.getElementById(id) ||
          document.querySelector('[data-page="' + id + '"]') ||
          document.querySelector('[data-route="' + id + '"]');

        if (target) {
          activatePageForElement(target);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.location.hash = "#" + id;
        }
      }

      document.addEventListener("submit", function (event) {
        event.preventDefault();
      });

      document.addEventListener("click", function (event) {
        var clicked = event.target;
        if (!(clicked instanceof Element)) return;
        var anchor = clicked.closest("a");
        if (!anchor) return;

        var href = (anchor.getAttribute("href") || "").trim();
        if (!href || href === "#") return;
        if (href.startsWith("javascript:")) return;
        if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

        var inPreviewHash = href.startsWith("#") ? href : getHashTarget(href);
        if (inPreviewHash) {
          event.preventDefault();
          navigateInsidePreview(inPreviewHash);
          return;
        }

        event.preventDefault();
      });
    })();
  </script>`;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${guardScript}</body>`);
  }
  return `${html}${guardScript}`;
}

type BuilderChatPanelProps = {
  variant: "desktop" | "sheet";
  onClose?: () => void;
  messages: Message[];
  isTyping: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  credits: number;
  chatError: string | null;
  input: string;
  setInput: (v: string) => void;
  isSending: boolean;
  canSend: boolean;
  onSend: () => void;
};

function BuilderChatPanel({
  variant,
  onClose,
  messages,
  isTyping,
  bottomRef,
  credits,
  chatError,
  input,
  setInput,
  isSending,
  canSend,
  onSend,
}: BuilderChatPanelProps) {
  const isSheet = variant === "sheet";

  return (
    <>
      <div
        className={
          isSheet
            ? "shrink-0 border-b border-white/10 bg-black/80 px-4 pb-3 pt-2 backdrop-blur"
            : "sticky top-0 z-10 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur"
        }
      >
        {isSheet ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-1 w-10 rounded-full bg-white/25" aria-hidden />
            <div className="flex w-full items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">AI Chat</h2>
                <p className="mt-0.5 text-xs text-white/45">
                  Refine layout, copy, and sections
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-white/85">AI Chat</h2>
            <p className="mt-1 text-xs text-white/40">
              Ask for layout changes, new sections, or copy tweaks.
            </p>
          </>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 text-sm text-white/70">
        {messages.length === 0 ? (
          <p className="text-white/40">No messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-green text-black"
                    : "mr-auto bg-white/10 text-white/90"
                }`}
              >
                <p
                  className={`text-[11px] uppercase tracking-wider ${
                    msg.role === "user" ? "text-black/60" : "text-white/50"
                  }`}
                >
                  {msg.role === "user" ? "You" : "AI"}
                </p>
                <p className="mt-1 whitespace-pre-line">{msg.content}</p>
              </div>
            ))}
            {isTyping ? (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-white/80">
                <p className="text-[11px] uppercase tracking-wider text-white/50">
                  AI
                </p>
                <p className="mt-1">Typing…</p>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-white/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {credits <= 0 ? (
          <div className="mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
            You are out of credits. Upgrade to continue.
          </div>
        ) : null}
        {chatError ? (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {chatError}
          </div>
        ) : null}
        <textarea
          className="w-full resize-none rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-green/50 focus:ring-2 focus:ring-green/20 disabled:opacity-60"
          placeholder="Ask the AI to refine the website..."
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={isSending || credits <= 0}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="mt-3 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? "Updating..." : "Send"}
        </button>
      </div>
    </>
  );
}

export default function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const credits = user?.credits ?? 0;
  const plan = user?.plans ?? "free";
  const [code, setCode] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deployNotice, setDeployNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [chatSheetOpen, setChatSheetOpen] = useState(false);
  const [formattedCodeForEditor, setFormattedCodeForEditor] = useState(
    "No code available yet.",
  );
  const [isAlreadyDeployed, setIsAlreadyDeployed] = useState(false);
  const previewDoc = useMemo(() => buildPreviewDoc(code), [code]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (!chatSheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [chatSheetOpen]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!id) return;
    const loadWebsite = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/website/${id}`, {
          withCredentials: true,
        });
        console.log("res", res.data);
        setCode(res.data.website.code || "");
        setMessages(res.data.website.conversation || []);
        setIsAlreadyDeployed(Boolean(res.data.website?.deployed));
        setDeployUrl(res.data.website?.deployedUrl ?? null);
      } catch {
        setError("Failed to load website.");
      } finally {
        setIsLoading(false);
      }
    };
    loadWebsite();
  }, [id]);

  useEffect(() => {
    const raw = code?.trim() ?? "";
    if (!raw) {
      setFormattedCodeForEditor("No code available yet.");
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const formatted = await prettier.format(raw, {
          parser: "html",
          plugins: [htmlPlugin],
          printWidth: 100,
          tabWidth: 2,
          htmlWhitespaceSensitivity: "css",
        });
        if (!cancelled) setFormattedCodeForEditor(formatted);
      } catch {
        if (!cancelled) setFormattedCodeForEditor(raw);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !id || isSending || credits <= 0) return;

    // optimistic user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);
    setIsTyping(true);
    setChatError(null);

    try {
      const res = await axios.post(
        `${serverUrl}/api/website/${id}/chat`,
        { message: text },
        { withCredentials: true },
      );

      // AI reply + updated code
      if (res.data.aiMessage) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: res.data.aiMessage },
        ]);
      }
      if (res.data.code) {
        setCode(res.data.code);
      }
      if (typeof res.data.credits === "number") {
        dispatch(updateCredits(res.data.credits));
      }
    } catch {
      setChatError("Sorry, I couldn’t update the site. Try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I couldn’t update the site. Try again.",
        },
      ]);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const canSend = credits > 0 && input.trim().length > 0 && !isSending;

  const handleCopy = async () => {
    if (!code) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handlePreviewLoad = (
    event: React.SyntheticEvent<HTMLIFrameElement>,
  ) => {
    try {
      const href = event.currentTarget.contentWindow?.location.href ?? "";
      if (href && !href.startsWith("about:srcdoc")) {
        event.currentTarget.srcdoc = previewDoc;
      }
    } catch {
      // Keep preview stable even if iframe URL is not readable.
    }
  };

  const chatPanelProps: Omit<BuilderChatPanelProps, "variant" | "onClose"> = {
    messages,
    isTyping,
    bottomRef,
    credits,
    chatError,
    input,
    setInput,
    isSending,
    canSend,
    onSend: handleSend,
  };

  const handleDeploy = async () => {
    if (!id || isDeploying) return;

    setIsDeploying(true);
    setDeployNotice(null);

    try {
      const res = await axios.post(
        `${serverUrl}/api/website/${id}/deploy`,
        {},
        { withCredentials: true },
      );

      const url = res.data?.url as string | undefined;
      if (!url) {
        setDeployNotice("Deploy failed. Missing URL.");
        return;
      }

      setDeployUrl(url);
      setIsAlreadyDeployed(true);
      setDeployNotice("Website deployed successfully.");
    } catch (error) {
      console.error(error);
      setDeployNotice("Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col bg-black text-white pt-4 pb-[env(safe-area-inset-bottom)] lg:pt-6">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col min-h-0 px-4 pb-24 lg:h-[calc(100vh-48px)] lg:max-h-[calc(100vh-48px)] lg:flex-none lg:px-5 lg:pb-8">
        <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2 text-xs text-white/70 sm:text-sm">
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Credits: <span className="text-green">{credits}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Plan: <span className="text-white/90">{plan}</span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:min-h-0 lg:flex-row lg:gap-6">
          {/* Desktop: chat sidebar */}
          <aside className="hidden min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/5 lg:flex lg:w-[40%] lg:flex-[0_0_40%] lg:min-w-[300px]">
            <BuilderChatPanel variant="desktop" {...chatPanelProps} />
          </aside>

          {/* Preview + code — first on mobile/tablet */}
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:w-[60%] lg:flex-[0_0_60%]">
            <div className="flex shrink-0 flex-col gap-3 border-b border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90">
                  {viewMode === "preview" ? "Live Preview" : "HTML Code"}
                </p>
                {deployNotice ? (
                  <p className="mt-1 text-xs text-white/40">{deployNotice}</p>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
                <div className="flex shrink-0 items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-xs text-white/70">
                  <button
                    type="button"
                    onClick={() => setViewMode("preview")}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition sm:py-1 ${
                      viewMode === "preview"
                        ? "bg-white text-black"
                        : "hover:text-white"
                    }`}
                  >
                    <Eye className="size-4 shrink-0" aria-hidden />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("code")}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition sm:py-1 ${
                      viewMode === "code"
                        ? "bg-white text-black"
                        : "hover:text-white"
                    }`}
                  >
                    <Code2 className="size-4 shrink-0" aria-hidden />
                    Code
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? "Code copied" : "Copy code"}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/30 hover:text-white sm:px-3"
                >
                  <Copy className="size-4 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">
                    {copied ? "Copied" : "Copy code"}
                  </span>
                </button>
                {deployUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={new URL(deployUrl).pathname}
                      className="inline-flex items-center gap-2 rounded-full bg-green px-3 py-1.5 text-xs font-semibold text-black"
                    >
                      Visit live site
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDeploy}
                    disabled={isSending || !code || isDeploying}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green px-2.5 py-1.5 text-xs font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
                  >
                    <Rocket className="size-4 shrink-0" aria-hidden />
                    {isDeploying ? "Deploying..." : "Deploy"}
                  </button>
                )}
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col rounded-b-2xl bg-black/40 p-2">
              {isSending && viewMode === "preview" ? (
                <div className="absolute inset-2 z-10 flex items-center justify-center rounded-lg bg-black/70 text-sm text-white/80">
                  Updating preview…
                </div>
              ) : null}

              <div className="relative min-h-0 flex-1">
                {viewMode === "preview" ? (
                  <iframe
                    title="Website preview"
                    className="absolute inset-0 h-full w-full rounded-lg border-0 bg-white"
                    sandbox="allow-same-origin allow-scripts"
                    srcDoc={previewDoc}
                    onLoad={handlePreviewLoad}
                  />
                ) : (
                  <Editor
                    value={formattedCodeForEditor}
                    language="html"
                    theme="vs-dark"
                    height="100%"
                    options={{
                      readOnly: true,
                      wordWrap: "on",
                      minimap: { enabled: false },
                    }}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Mobile / tablet: floating AI chat entry */}
        <button
          type="button"
          onClick={() => setChatSheetOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-linear-to-r from-green/90 to-emerald-400/90 px-5 py-3 text-sm font-semibold text-black shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition hover:brightness-105 active:scale-[0.98] lg:hidden"
          style={{ marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
        >
          <MessageSquareText className="size-5 shrink-0" aria-hidden />
          AI Chat · Refine
        </button>

        {/* Bottom sheet: full-height feel, slide up */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${chatSheetOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!chatSheetOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              chatSheetOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close chat overlay"
            tabIndex={chatSheetOpen ? 0 : -1}
            onClick={() => setChatSheetOpen(false)}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 flex max-h-[96dvh] flex-col rounded-t-3xl border border-white/10 border-b-0 bg-[#0a0a0a] shadow-[0_-12px_48px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              chatSheetOpen ? "translate-y-0" : "translate-y-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="builder-chat-sheet-title"
          >
            <span id="builder-chat-sheet-title" className="sr-only">
              AI chat to refine your website
            </span>
            <div className="flex min-h-0 max-h-[96dvh] flex-1 flex-col overflow-hidden">
              <BuilderChatPanel
                variant="sheet"
                onClose={() => setChatSheetOpen(false)}
                {...chatPanelProps}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
