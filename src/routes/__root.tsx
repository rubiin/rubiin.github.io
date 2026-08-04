/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react'
import appCss from '../styles/globals.css?url'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { QueryProvider } from '@/components/layout/query-provider'
import { LenisProvider } from '@/components/layout/lenis-provider'
import { SkipLink } from '@/components/layout/skip-link'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { NotFoundComponent } from '@/components/layout/not-found'
import { ErrorComponent } from '@/components/layout/error-boundary'
import { Toaster } from '@/components/ui/sonner'
import { BootScreen } from '@/components/layout/boot-screen'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { AnimatedFavicon } from '@/components/layout/animated-favicon'
import { FloatingDock } from '@/components/layout/floating-dock'
import { EasterEggs } from '@/components/layout/easter-eggs'
import { siteConfig } from '@/data/site'
import { absoluteUrl, jsonLdPerson } from '@/lib/seo'
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from '@/lib/storage'

// The palette (cmdk + dialog) is closed on every page — split it out of
// the critical-path entry and load it asynchronously. Suspense mounts it as
// soon as the chunk arrives, so ⌘K works right away while keeping first
// paint lean.
const CommandPalette = lazy(() =>
  import('@/components/layout/command-palette').then((m) => ({ default: m.CommandPalette })),
)

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  pendingComponent: RootSkeleton,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Rubin Bhandari — Software Engineer',
      },
      {
        name: 'description',
        content:
          'Portfolio and blog of Rubin Bhandari — full-stack developer crafting robust web applications and API systems.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: siteConfig.name },
      { property: 'og:title', content: siteConfig.seo.title },
      { property: 'og:description', content: siteConfig.seo.description },
      { property: 'og:url', content: absoluteUrl('/') },
      { property: 'og:image', content: absoluteUrl(siteConfig.seo.ogImage) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteConfig.seo.title },
      { name: 'twitter:description', content: siteConfig.seo.description },
      { name: 'twitter:image', content: absoluteUrl(siteConfig.seo.ogImage) },
      { name: 'theme-color', content: '#0f172a' },
      {
        name: 'keywords',
        content: siteConfig.seo.keywords.join(', '),
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(jsonLdPerson()),
      },
      {
        // Apply the persisted theme before first paint so dark-mode users
        // never see a light flash (rendering-hydration-no-flicker). Mirrors
        // resolveTheme + applyTheme in theme-store; runs synchronously in
        // <head>, before the body renders.
        children: `(function(){try{var t=localStorage.getItem('${STORAGE_KEYS.theme}')||localStorage.getItem('${LEGACY_STORAGE_KEYS.theme}');var theme=t==='light'||t==='dark'||t==='system'?t:'system';var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;var root=document.documentElement;root.classList.toggle('dark',resolved==='dark');root.style.colorScheme=resolved}catch(e){}})()`,
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', href: '/og.png' },
      { rel: 'apple-touch-icon', href: '/og.png' },
    ],
  }),
  shellComponent: RootDocument,
  component: () => (
    <>
      <SkipLink />
      <BootScreen />
      <AmbientBackground />
      <AnimatedFavicon />
      <EasterEggs />
      <LenisProvider>
        <RouteFocusReset />
        <ScrollProgress />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
          <Outlet />
        </main>
        <SiteFooter />
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      </LenisProvider>
      <FloatingDock />
      <Toaster richColors position="bottom-right" />
    </>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
        <Scripts />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}

function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.warn('Service worker registration failed:', error)
      })
    }
  }, [])

  return null
}

/**
 * Moves keyboard/screen-reader focus to main content after each route
 * change (skipping the initial load, where the skip link covers it).
 */
function RouteFocusReset() {
  const pathname = useLocation().pathname
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}

function RootSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-full max-w-2xl" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((value, index) => (
          <div key={index} className="rounded-3xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
