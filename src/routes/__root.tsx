/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '../styles/globals.css?url'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { QueryProvider } from '@/components/layout/query-provider'
import { LenisProvider } from '@/components/layout/lenis-provider'
import { SkipLink } from '@/components/layout/skip-link'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { CommandPalette } from '@/components/layout/command-palette'
import { NotFoundComponent } from '@/components/layout/not-found'
import { ErrorComponent } from '@/components/layout/error-boundary'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
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
        title: 'Devina — Creative Developer',
      },
      {
        name: 'description',
        content:
          'Portfolio and blog of Devina — creative developer crafting premium web experiences.',
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
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: () => (
    <>
      <SkipLink />
      <LenisProvider>
        <ScrollProgress />
        <SiteHeader />
        <main id="main" className="min-h-[60vh]">
          <Outlet />
        </main>
        <SiteFooter />
        <CommandPalette />
      </LenisProvider>
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
      </body>
    </html>
  )
}
