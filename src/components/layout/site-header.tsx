'use client'

import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Command, Download } from 'lucide-react'
import { navItems } from '@/data/nav'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { PaletteToggle } from '@/components/layout/palette-toggle'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GitHubIcon } from '@/components/ui/brand-icons'
import { cn } from '@/lib/utils'
import { openCommandPalette } from '@/stores/command-store'
import { lenisScrollTo } from '@/hooks/use-lenis'
import { useActiveSection } from '@/hooks/use-active-section'

const SECTION_IDS = ['about', 'skills', 'experience', 'projects']

/**
 * Derived scroll state: only the boolean the header actually needs, so the
 * component re-renders on the threshold crossing — not on every scroll
 * event (rerender-derived-state).
 */
function useElevatedHeader() {
  const [elevated, setElevated] = useState(false)
  // rAF-throttled: the boolean only flips on the threshold crossing, so
  // batch scroll events into at most one setState per frame.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setElevated(window.scrollY > 8))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return elevated
}

export function SiteHeader() {
  const elevated = useElevatedHeader()
  const location = useLocation()

  const pathname = location.pathname
  // Scrollspy only on the home page (where the anchor sections live).
  const activeSection = useActiveSection(SECTION_IDS, pathname === '/')

  const handleNavClick = (href: string) => {
    // Smooth-scroll in-page anchors when already on the target page.
    if (href.startsWith('/#') && pathname === '/') {
      lenisScrollTo(href.slice(1))
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        elevated
          ? 'border-b border-transparent bg-background/70 shadow-[0_16px_48px_-24px_color-mix(in_oklab,var(--primary)_45%,transparent)] backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      {/* Gradient hairline under the bar when elevated */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-300',
          elevated ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.name}
          <span className="text-gradient">.</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            // Download actions are direct links, styled as a CTA button and
            // placed last in the nav — visually distinct from page links.
            if (item.download) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  download
                  className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent-secondary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-[0_4px_18px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_color-mix(in_oklab,var(--accent-secondary)_75%,transparent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 dark:text-[#05060e]"
                >
                  <Download
                    className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden
                  />
                  {item.label}
                </a>
              )
            }
            const isAnchor = item.href.startsWith('/#')
            const active = isAnchor
              ? pathname === '/' && item.href === `/#${activeSection}`
              : pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors nav-underline',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-primary/15 to-accent-secondary/15 ring-1 ring-primary/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCommandPalette}
                  aria-label="Open command palette (⌘K)"
                  className="hidden sm:inline-flex"
                >
                  <Command className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Command</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  aria-label="GitHub profile"
                  className="hidden sm:inline-flex"
                >
                  <a href={siteConfig.socials.github} target="_blank" rel="noreferrer">
                    <GitHubIcon className="size-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">GitHub</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ThemeToggle tooltip="Theme" />
          <PaletteToggle tooltip="Palette" />

          <MobileNav />
        </div>
      </div>
    </header>
  )
}
