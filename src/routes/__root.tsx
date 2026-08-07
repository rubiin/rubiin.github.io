/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react'
import appCss from '../styles/globals.css?url'
// Self-hosted variable fonts replace the render-blocking Google Fonts link.
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
// Preload the latin subsets this English site renders so first paint swaps fast.
import interLatinWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
import spaceGroteskLatinWoff2 from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'
import jetbrainsMonoLatinWoff2 from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { QueryProvider } from '@/components/layout/query-provider'
import { LenisProvider } from '@/components/layout/lenis-provider'
import { SkipLink } from '@/components/layout/skip-link'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { NotFoundComponent } from '@/components/layout/not-found'
import { ErrorComponent } from '@/components/layout/error-boundary'
import { Toaster } from '@/components/ui/sonner'
import { PageLoader, PendingLoader } from '@/components/layout/page-loader'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { AnimatedFavicon } from '@/components/layout/animated-favicon'
import { FloatingDock } from '@/components/layout/floating-dock'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
import { EasterEggs } from '@/components/layout/easter-eggs'
import { siteConfig } from '@/data/site'
import { absoluteUrl, jsonLdPerson } from '@/lib/seo'
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from '@/lib/storage'

// ⌘K palette is closed on every page — load its chunk off the critical path.
const CommandPalette = lazy(() =>
  import('@/components/layout/command-palette').then((m) => ({ default: m.CommandPalette })),
)

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  pendingComponent: PendingLoader,
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
      { name: 'theme-color', content: '#05060e' },
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
        // Apply the persisted theme pre-paint to avoid a dark/light flash.
        children: `(function(){try{var t=localStorage.getItem('${STORAGE_KEYS.theme}')||localStorage.getItem('${LEGACY_STORAGE_KEYS.theme}');var theme=t==='light'||t==='dark'||t==='system'?t:'system';var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;var root=document.documentElement;root.classList.toggle('dark',resolved==='dark');root.style.colorScheme=resolved}catch(e){}})()`,
      },
      {
        // Only show the boot loader on genuine first visits.
        children: `(function(){try{var done=sessionStorage.getItem('${STORAGE_KEYS.bootDone}')||sessionStorage.getItem('${LEGACY_STORAGE_KEYS.bootDone}');var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(done!=='1'&&!reduced){document.documentElement.classList.add('boot-show')}}catch(e){}})()`,
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preload',
        href: interLatinWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: spaceGroteskLatinWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: jetbrainsMonoLatinWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/og.png' },
    ],
  }),
  shellComponent: RootDocument,
  component: () => (
    <>
      <SkipLink />
      <PageLoader />
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
      <ScrollToTop />
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

// Focus main content on route change (skip the initial load — skip link covers it).
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
