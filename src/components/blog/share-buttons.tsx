'use client'

import { useState } from 'react'
// lucide v1 removed brand icons; use thematic substitutes (matches footer).
import { AtSign, Briefcase, Check, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Share row for an article: X/Twitter, LinkedIn, and copy-link. Uses the
 * canonical URL (siteConfig.url + path) for share targets.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share</span>
      <Button variant="outline" size="icon" asChild aria-label="Share on X">
        <a href={twitterHref} target="_blank" rel="noopener noreferrer">
          <AtSign className="size-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild aria-label="Share on LinkedIn">
        <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
          <Briefcase className="size-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={copy} aria-label="Copy link">
        {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
      </Button>
    </div>
  )
}
