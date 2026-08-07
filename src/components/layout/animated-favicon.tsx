'use client'

import { useEffect } from 'react'

// Canvas "R" monogram favicon; animates only while the tab has focus.
export function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const link =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
      (() => {
        const l = document.createElement('link')
        l.rel = 'icon'
        document.head.appendChild(l)
        return l
      })()
    if (!ctx) return

    const cssVar = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      return v || fallback
    }

    const draw = (angle: number, animated: boolean) => {
      const bg = cssVar('--background', '#0a192f')
      const brand = cssVar('--primary', '#5b8cff')
      const fg = cssVar('--foreground', '#ccd6f6')

      ctx.clearRect(0, 0, 32, 32)
      ctx.fillStyle = bg
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath()
        ctx.roundRect(1, 1, 30, 30, 7)
        ctx.fill()
      } else {
        ctx.fillRect(1, 1, 30, 30)
      }

      ctx.strokeStyle = brand
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(16, 16, 11, -Math.PI / 2, -Math.PI / 2 + angle)
      ctx.stroke()

      ctx.fillStyle = fg
      ctx.font = '700 16px Inter, ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('R', 16, 17)

      if (animated) link.href = canvas.toDataURL()
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Redraw on theme toggle (class flips on <html>).
    const themeObserver = new MutationObserver(() => draw(angle, document.hasFocus()))
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    let angle = 0
    let interval = 0
    if (reduced) {
      draw(0, true)
      return () => themeObserver.disconnect()
    }

    // Throttled to ~2.5fps — each tick does a synchronous toDataURL + href swap.
    interval = window.setInterval(() => {
      if (document.hasFocus()) {
        angle = (angle + 0.73) % (Math.PI * 2)
        draw(angle, true)
      } else {
        draw(Math.PI / 2, false)
      }
    }, 400)

    return () => {
      clearInterval(interval)
      themeObserver.disconnect()
    }
  }, [])

  return null
}
