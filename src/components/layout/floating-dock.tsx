'use client'

import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AtSign, Briefcase, Command, GitBranch, Mail, Rss, TerminalSquare } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siteConfig } from '@/data/site'
import { openCommandPalette } from '@/stores/command-store'
import { cn } from '@/lib/utils'

const SOCIALS = [
  { label: 'GitHub', href: siteConfig.socials.github, icon: GitBranch },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, icon: Briefcase },
  { label: 'Twitter', href: siteConfig.socials.twitter, icon: AtSign },
  { label: 'RSS', href: siteConfig.socials.rss, icon: Rss },
]

/**
 * Floating glass dock: quick socials + contact + terminal + ⌘K, pinned
 * bottom-center. Compresses gently on scroll (so it never fights the page)
 * and expands on hover.
 */
export function FloatingDock() {
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      className={cn(
        'fixed bottom-4 left-1/2 z-40 -translate-x-1/2',
        // Safe-area aware on notched devices
        'pb-[env(safe-area-inset-bottom)]',
      )}
      animate={
        reduced
          ? undefined
          : scrolled
            ? { scale: 0.92, opacity: 0.72, y: 6 }
            : { scale: 1, opacity: 1, y: 0 }
      }
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onHoverStart={() => !reduced && setScrolled(false)}
      onHoverEnd={() => !reduced && setScrolled(window.scrollY > 140)}
    >
      <div className="glass flex items-center gap-0.5 rounded-full px-2 py-1.5 shadow-lg shadow-black/5">
        {SOCIALS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
            aria-label={label}
            title={label}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-4" />
          </a>
        ))}

        <span aria-hidden className="mx-1 h-5 w-px bg-border" />

        <a
          href="mailto:hello@devina.dev"
          aria-label="Email"
          title="Email"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Mail className="size-4" />
        </a>

        <Link
          to={'/terminal' as string}
          aria-label="Open terminal"
          title="Terminal"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <TerminalSquare className="size-4" />
        </Link>

        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Open command palette (⌘K)"
          title="Command palette"
          className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Command className="size-4" />
        </button>
      </div>
    </motion.div>
  )
}
