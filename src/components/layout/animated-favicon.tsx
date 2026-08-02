'use client'

import { useEffect } from 'react'

/**
 * Animated favicon: a canvas "D" monogram with a slowly rotating mint ring.
 * Only animates while the tab has focus (and motion is allowed); otherwise
 * it renders a static frame. Colors are read from the theme tokens so it
 * follows light/dark automatically. Returns null — pure side effect.
 */
export function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const link =
      (document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
        (() => {
          const l = document.createElement('link')
          l.rel = 'icon'
          document.head.appendChild(l)
          return l
        })())
    if (!ctx) return

    const cssVar = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      return v || fallback
    }

    const draw = (angle: number, animated: boolean) => {
      const bg = cssVar('--background', '#0a192f')
      const mint = cssVar('--primary', '#64ffda')
      const fg = cssVar('--foreground', '#ccd6f6')

      ctx.clearRect(0, 0, 32, 32)
      // Rounded backdrop
      ctx.beginPath()
      ctx.roundRect(1, 1, 30, 30, 7)
      ctx.fillStyle = bg
      ctx.fill()

      // Rotating ring (arc from -90°)
      ctx.strokeStyle = mint
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(16, 16, 11, -Math.PI / 2, -Math.PI / 2 + angle)
      ctx.stroke()

      // "D" monogram
      ctx.fillStyle = fg
      ctx.font = '700 16px Inter, ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('D', 16, 17)

      if (animated) link.href = canvas.toDataURL()
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Redraw on theme toggle too.
    const themeObserver = new MutationObserver(() => draw(angle, document.hasFocus()))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let angle = 0
    let interval = 0
    if (reduced) {
      draw(0, true)
      return () => themeObserver.disconnect()
    }

    interval = window.setInterval(() => {
      if (document.hasFocus()) {
        angle = (angle + 0.22) % (Math.PI * 2)
        draw(angle, true)
      } else {
        // Static ring quarter while unfocused (cheap, once per tick).
        draw(Math.PI / 2, false)
      }
    }, 120)

    // Respect light/dark: force a redraw when theme class flips.
    return () => {
      clearInterval(interval)
      themeObserver.disconnect()
    }
  }, [])

  return null
}
