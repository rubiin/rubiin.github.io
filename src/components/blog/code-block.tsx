'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Client component that highlights code with Shiki and provides a
 * copy-to-clipboard button. Falls back to a plain <pre> if Shiki fails.
 */
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
    import('shiki')
      .then(async (shiki) => {
        const highlighter = await shiki.createHighlighter({
          themes: ['github-dark'],
          langs: [lang && lang !== 'txt' ? lang : 'text'],
        })
        const out = highlighter.codeToHtml(code, {
          lang: lang && lang !== 'txt' ? lang : 'text',
          theme: 'github-dark',
        })
        highlighter.dispose()
        if (!cancelled) setHtml(out)
      })
      .catch(() => {
        if (!cancelled) setHtml(null)
      })
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
    <div className={cn('group relative my-4 overflow-hidden rounded-lg border border-border', className)}>
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
