/**
 * Portfolio service worker — update-friendly caching.
 *
 * Strategy:
 *  - Navigations: NETWORK-FIRST. Deployed HTML is fetched fresh on every
 *    load; the successful response is cached so the site still works
 *    offline. A `skipWaiting()` + `clients.claim()` pair makes a new SW
 *    (and its new content) take effect on the very next reload.
 *  - Static assets (hashed JS/CSS, images, fonts): stale-while-revalidate.
 *    Serve the cached copy instantly, refresh it in the background. Hashed
 *    asset URLs change every build, so freshness is automatic.
 *  - Dev (localhost): no interception at all — Vite's unhashed URLs change
 *    between edits, so caching there would cause exactly the stale-content
 *    problem this file is meant to kill.
 *
 * Bump CACHE_VERSION on purpose only when the *strategy* changes; the
 * activate handler purges every other cache with our prefix (including
 * the old `portfolio-cache-v1`), so content updates never depend on it.
 */
const CACHE_PREFIX = 'portfolio-cache'
const CACHE_VERSION = 'v2'
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`
const PRECACHE_ASSETS = ['/', '/og.png', '/manifest.webmanifest']

// Dev guard: localhost/loopback plus the common Vite ports (also covers
// LAN-IP testing where the hostname isn't localhost).
const DEV_PORTS = new Set([5173, 4173, 3000])
const isDev =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  DEV_PORTS.has(Number(self.location.port))

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // allSettled: one failing asset (e.g. a 404) must not abort the whole
      // install — otherwise there'd be no service worker at all.
      .then((cache) => Promise.allSettled(PRECACHE_ASSETS.map((asset) => cache.add(asset))))
      // Don't wait for all tabs to close — activate and take control now.
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (isDev) return

  const { request } = event
  const url = new URL(request.url)

  // Only intercept same-origin GETs; let everything else hit the network.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Navigations: network-first, offline fallback to the cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigations so offline reloads still work.
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/'))
        )
    )
    return
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
