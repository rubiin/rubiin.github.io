'use client'

import { Link, useLocation } from '@tanstack/react-router'
import { Download, Mail, Rss } from 'lucide-react'
import { navItems } from '@/data/nav'
import { siteConfig } from '@/data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/ui/brand-icons'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils'

const SOCIALS = [
  { label: 'GitHub', href: siteConfig.socials.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, icon: LinkedInIcon },
  { label: 'X', href: siteConfig.socials.twitter, icon: XIcon },
  { label: 'RSS', href: siteConfig.socials.rss, icon: Rss },
  { label: 'Email', href: siteConfig.socials.email, icon: Mail },
]

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const location = useLocation()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>
            {siteConfig.name}
            <span className="text-primary">.</span>
          </SheetTitle>
          <SheetDescription>{siteConfig.tagline}</SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            // Download actions are direct links, styled as a filled CTA and
            // placed last in the nav.
            if (item.download) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  download
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent-secondary px-3 py-2.5 text-base font-semibold text-primary-foreground shadow-[0_4px_18px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:text-[#05060e]"
                >
                  <Download className="size-4" aria-hidden />
                  {item.label}
                </a>
              )
            }
            const active = !item.href.startsWith('/#') && location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 px-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-1.5 border-t pt-4">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
