'use client'

import { useEffect, useRef } from 'react'
import { GISCUS_CATEGORY, GISCUS_CATEGORY_ID, GISCUS_REPO, GISCUS_REPO_ID } from '@/lib/constants'

/**
 * Giscus comment thread (GitHub Discussions powered). Injects the giscus
 * script on mount so it never blocks initial render. Rendering is skipped
 * entirely under reduced motion.
 */
export function PostComments({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const container = ref.current
    if (!container) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', GISCUS_REPO)
    script.setAttribute('data-repo-id', GISCUS_REPO_ID)
    script.setAttribute('data-category', GISCUS_CATEGORY)
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', `post-${slug}`)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')

    // The comment thread sits below the fold and is third-party — inject it
    // during idle time so it never competes with the article's initial load
    // (js-request-idle-callback). requestIdleCallback is widely supported;
    // fall back to a short timeout elsewhere.
    const hasIdle = 'requestIdleCallback' in window
    const inject = () => {
      if (!container.isConnected) return
      container.appendChild(script)
    }
    const idleId = hasIdle
      ? window.requestIdleCallback(inject, { timeout: 2000 })
      : window.setTimeout(inject, 2000)

    return () => {
      if (hasIdle) window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
      script.remove()
    }
  }, [slug])

  return (
    <section aria-label="Comments" className="mt-16">
      <h2 className="mb-6 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
        Discussion
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </h2>
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div ref={ref} className="min-h-32" />
      </div>
      <noscript>Comments require JavaScript and GitHub Discussions.</noscript>
    </section>
  )
}
