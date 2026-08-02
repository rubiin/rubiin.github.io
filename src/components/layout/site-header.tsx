'use client'

import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Command, GitBranch, Menu } from 'lucide-react'
import { navItems } from '@/data/nav'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { MobileNav } from '@/components/layout/mobile-nav'
import { cn } from '@/lib/utils'
import { openCommandPalette } from '@/stores/command-store'
import { lenisScrollTo } from '@/hooks/use-lenis'

/** Tiny scroll-position hook, local to the header. */
function useScrollPosition() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return y
}

export function SiteHeader() {
  const y = useScrollPosition()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const elevated = y > 8
  const pathname = location.pathname

  const handleNavClick = (href: string) => {
    // Smooth-scroll in-page anchors when already on the target page.
    if (href.startsWith('/#') && pathname === '/') {
      lenisScrollTo(href.slice(1))
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        elevated
          ? 'border-border/60 bg-background/70 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.name}
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href !== '/#skills' && !item.href.startsWith('/#') && pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            aria-label="Open command palette (⌘K)"
            className="hidden sm:inline-flex"
          >
            <Command className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="GitHub profile"
            className="hidden sm:inline-flex"
          >
            <a href={siteConfig.socials.github} target="_blank" rel="noreferrer">
              <GitBranch className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  )
}
