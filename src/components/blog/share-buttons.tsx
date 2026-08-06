'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { FacebookIcon, LinkedInIcon, XIcon } from '@/components/ui/brand-icons'

/**
 * Share row for an article: X, LinkedIn, Facebook, and copy-link. Uses the
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

  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`

  const iconBtn =
    'glass flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted-foreground">Share</span>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={iconBtn}
      >
        <XIcon className="size-4" />
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={iconBtn}
      >
        <LinkedInIcon className="size-4" />
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={iconBtn}
      >
        <FacebookIcon className="size-4" />
      </a>
      <button type="button" onClick={copy} aria-label="Copy link" className={iconBtn}>
        {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
      </button>
    </div>
  )
}
