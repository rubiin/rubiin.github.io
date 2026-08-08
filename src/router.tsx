import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    // Route prefetching (checklist #28): 'intent' preloads chunks + loader
    // data after ~50 ms of hover/focus/touch on every <Link>. Below-fold
    // card grids opt into `preload="viewport"` for scroll-based prefetch.
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPendingMinMs: 300,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
