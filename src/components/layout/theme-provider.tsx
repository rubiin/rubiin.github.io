'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { applyTheme, themeStore } from '@/stores/theme-store'

/**
 * Applies the persisted theme to <html> on the client and keeps the
 * "system" mode in sync with OS preference changes. Renders nothing —
 * purely a side-effect provider.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    applyTheme(themeStore.state)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme(themeStore.state)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mounted])

  return <>{children}</>
}
