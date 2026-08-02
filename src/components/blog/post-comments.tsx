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
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    container.appendChild(script)

    return () => {
      script.remove()
    }
  }, [slug])

  return (
    <section aria-label="Comments" className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Discussion</h2>
      <div ref={ref} className="min-h-32" />
      <noscript>Comments require JavaScript and GitHub Discussions.</noscript>
    </section>
  )
}
