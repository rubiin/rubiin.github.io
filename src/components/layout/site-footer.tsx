'use client'

import { Heart, Mail, Rss } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/ui/brand-icons'

const SOCIALS = [
  { label: 'GitHub', href: siteConfig.socials.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, icon: LinkedInIcon },
  { label: 'X', href: siteConfig.socials.twitter, icon: XIcon },
  { label: 'RSS', href: siteConfig.socials.rss, icon: Rss },
  { label: 'Email', href: siteConfig.socials.email, icon: Mail },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold tracking-tight">
            {siteConfig.name}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>
        </div>

        {/* Empty spacer keeps the 3-column grid layout (brand | space | else-where). */}
        <div aria-hidden className="hidden md:block" />

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Elsewhere
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Built with TanStack Start, Tailwind CSS, and Motion.
          </p>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="size-3.5 text-primary" aria-hidden /> in{' '}
            {siteConfig.location}.
          </p>
          <div className="flex items-center gap-4">
            <a href="/rss.xml" className="transition-colors hover:text-foreground">
              RSS
            </a>
            <a href="/sitemap.xml" className="transition-colors hover:text-foreground">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
