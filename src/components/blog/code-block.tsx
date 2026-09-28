"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Lazy per-language Shiki grammars (no ~0.6 MB oniguruma WASM umbrella).
const LANGUAGE_MODULES = {
  bash: { load: () => import("@shikijs/langs/bash"), id: "bash" },
  sh: { load: () => import("@shikijs/langs/bash"), id: "bash" },
  shell: { load: () => import("@shikijs/langs/bash"), id: "bash" },
  "shell-session": { load: () => import("@shikijs/langs/shell"), id: "shell" },
  console: { load: () => import("@shikijs/langs/shell"), id: "shell" },
  javascript: { load: () => import("@shikijs/langs/javascript"), id: "javascript" },
  js: { load: () => import("@shikijs/langs/javascript"), id: "javascript" },
  typescript: { load: () => import("@shikijs/langs/typescript"), id: "typescript" },
  ts: { load: () => import("@shikijs/langs/typescript"), id: "typescript" },
  vim: { load: () => import("@shikijs/langs/viml"), id: "viml" },
  viml: { load: () => import("@shikijs/langs/viml"), id: "viml" },
  scss: { load: () => import("@shikijs/langs/scss"), id: "scss" },
  dockerfile: { load: () => import("@shikijs/langs/dockerfile"), id: "dockerfile" },
  json: { load: () => import("@shikijs/langs/json"), id: "json" },
  go: { load: () => import("@shikijs/langs/go"), id: "go" },
  // Common extras — small on-demand chunks, fetched only when used.
  python: { load: () => import("@shikijs/langs/python"), id: "python" },
  css: { load: () => import("@shikijs/langs/css"), id: "css" },
  html: { load: () => import("@shikijs/langs/html"), id: "html" },
  xml: { load: () => import("@shikijs/langs/xml"), id: "xml" },
  yaml: { load: () => import("@shikijs/langs/yaml"), id: "yaml" },
  sql: { load: () => import("@shikijs/langs/sql"), id: "sql" },
  markdown: { load: () => import("@shikijs/langs/markdown"), id: "markdown" },
  rust: { load: () => import("@shikijs/langs/rust"), id: "rust" },
};

// Shiki-highlights code client-side; falls back to a plain <pre> on failure.
export function CodeBlock({
  code,
  lang,
  title,
  className,
}: {
  code: string;
  lang?: string;
  /** File name from the fence's `title="…"` meta (see remark-code-title). */
  title?: string;
  className?: string;
}) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const key = lang && lang !== "txt" && lang !== "text" ? lang.toLowerCase() : null;
    const grammar = key ? LANGUAGE_MODULES[key as keyof typeof LANGUAGE_MODULES] : null;

    const highlight = async () => {
      try {
        // Start the language chunk in parallel with the core bundle — the
        // grammar module doesn't depend on createHighlighterCore, so awaiting
        // it after would serialize two network fetches (a waterfall).
        const grammarModule = grammar?.load() ?? null;
        // Consume early rejections so a fast chunk failure isn't reported as
        // unhandled before the await below attaches; the inner try/catch
        // still handles it at that point.
        grammarModule?.catch(() => {});
        const [
          { createHighlighterCore, createCssVariablesTheme },
          { createJavaScriptRegexEngine },
        ] = await Promise.all([import("@shikijs/core"), import("@shikijs/engine-javascript")]);
        // CSS-variables theme: token colors are `var(--shiki-*)`, resolved from
        // the active palette in globals.css — code blocks re-theme live when the
        // palette/mode changes, with no re-highlighting or extra theme chunks.
        const cssTheme = createCssVariablesTheme();
        // Core + JS regex engine only, so no WASM fetch.
        const highlighter = await createHighlighterCore({
          themes: [cssTheme],
          langs: [],
          engine: createJavaScriptRegexEngine(),
        });

        try {
          if (grammarModule) {
            await highlighter.loadLanguage((await grammarModule).default);
          }
        } catch {
          // Unsupported language — render the plain fallback.
          if (!cancelled) setHtml(null);
          highlighter.dispose();
          return;
        }
        if (cancelled) {
          highlighter.dispose();
          return;
        }

        const out = highlighter.codeToHtml(code, {
          lang: grammar?.id ?? "text",
          theme: cssTheme,
        });
        highlighter.dispose();
        if (!cancelled) setHtml(out);
      } catch {
        if (!cancelled) setHtml(null);
      }
    };

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  // Shared by the highlighted and fallback paths so the block never reflows
  // when Shiki resolves after first paint.
  const bodyClassName =
    "overflow-x-auto px-8 py-6 text-[13px] leading-relaxed [tab-size:2] [scrollbar-width:thin] selection:bg-primary/25";

  return (
    <div
      className={cn(
        "code-card group relative my-4 overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_12px_32px_-24px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-primary/70 via-accent-secondary/50 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-8 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Full-strength foreground: `muted-foreground` falls below 4.5:1 on
              the pill in 13 of the 16 palette/mode combinations. */}
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-[11px] tracking-wider text-foreground uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-primary/60" />
            {lang ?? "code"}
          </span>
          {title ? (
            <span className="truncate font-mono text-xs text-foreground" title={title}>
              {title}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="text-muted-foreground opacity-80 transition-opacity group-hover:opacity-100"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="relative">
        {/* Both paths render the same shape — padded scroller wrapping a bare
            `pre` — so the prose `pre` shell can be neutralised in one place
            (`.code-card pre` in globals.css) and the two never diverge. */}
        <div className={cn(bodyClassName, "[&_pre]:!bg-transparent [&_code]:font-mono")}>
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <pre>
              <code>{code}</code>
            </pre>
          )}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
