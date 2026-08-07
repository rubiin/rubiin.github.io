'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Lazy per-language Shiki grammars (no ~0.6 MB oniguruma WASM umbrella).
const LANGUAGE_MODULES = {
  bash: { load: () => import('@shikijs/langs/bash'), id: 'bash' },
  sh: { load: () => import('@shikijs/langs/bash'), id: 'bash' },
  shell: { load: () => import('@shikijs/langs/bash'), id: 'bash' },
  'shell-session': { load: () => import('@shikijs/langs/shell'), id: 'shell' },
  console: { load: () => import('@shikijs/langs/shell'), id: 'shell' },
  javascript: { load: () => import('@shikijs/langs/javascript'), id: 'javascript' },
  js: { load: () => import('@shikijs/langs/javascript'), id: 'javascript' },
  typescript: { load: () => import('@shikijs/langs/typescript'), id: 'typescript' },
  ts: { load: () => import('@shikijs/langs/typescript'), id: 'typescript' },
  vim: { load: () => import('@shikijs/langs/viml'), id: 'viml' },
  viml: { load: () => import('@shikijs/langs/viml'), id: 'viml' },
  scss: { load: () => import('@shikijs/langs/scss'), id: 'scss' },
  dockerfile: { load: () => import('@shikijs/langs/dockerfile'), id: 'dockerfile' },
  json: { load: () => import('@shikijs/langs/json'), id: 'json' },
  go: { load: () => import('@shikijs/langs/go'), id: 'go' },
  // Common extras — small on-demand chunks, fetched only when used.
  python: { load: () => import('@shikijs/langs/python'), id: 'python' },
  css: { load: () => import('@shikijs/langs/css'), id: 'css' },
  html: { load: () => import('@shikijs/langs/html'), id: 'html' },
  xml: { load: () => import('@shikijs/langs/xml'), id: 'xml' },
  yaml: { load: () => import('@shikijs/langs/yaml'), id: 'yaml' },
  sql: { load: () => import('@shikijs/langs/sql'), id: 'sql' },
  markdown: { load: () => import('@shikijs/langs/markdown'), id: 'markdown' },
  rust: { load: () => import('@shikijs/langs/rust'), id: 'rust' },
}

// Shiki-highlights code client-side; falls back to a plain <pre> on failure.
export function CodeBlock({
  code,
  lang,
  className,
}: {
  code: string
  lang?: string
  className?: string
}) {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    const key = lang && lang !== 'txt' && lang !== 'text' ? lang.toLowerCase() : null
    const grammar = key ? LANGUAGE_MODULES[key as keyof typeof LANGUAGE_MODULES] : null

    const highlight = async () => {
      try {
        const [
          { createHighlighterCore },
          { default: githubDark },
          { createJavaScriptRegexEngine },
        ] = await Promise.all([
          import('@shikijs/core'),
          import('@shikijs/themes/github-dark'),
          import('@shikijs/engine-javascript'),
        ])
        // Core + JS regex engine only, so no WASM fetch.
        const highlighter = await createHighlighterCore({
          themes: [githubDark],
          langs: [],
          engine: createJavaScriptRegexEngine(),
        })

        try {
          if (grammar) {
            await highlighter.loadLanguage((await grammar.load()).default)
          }
        } catch {
          // Unsupported language — render the plain fallback.
          if (!cancelled) setHtml(null)
          highlighter.dispose()
          return
        }
        if (cancelled) {
          highlighter.dispose()
          return
        }

        const out = highlighter.codeToHtml(code, {
          lang: grammar?.id ?? 'text',
          theme: 'github-dark',
        })
        highlighter.dispose()
        if (!cancelled) setHtml(out)
      } catch {
        if (!cancelled) setHtml(null)
      }
    }

    void highlight()
    return () => {
      cancelled = true
    }
  }, [code, lang])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div
      className={cn(
        'group relative my-4 overflow-hidden rounded-lg border border-border',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-primary/70 via-accent-secondary/50 to-transparent"
      />
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">{lang ?? 'code'}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 opacity-70 transition-opacity group-hover:opacity-100"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
      {html ? (
        <div
          className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
