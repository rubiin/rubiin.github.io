'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useKonami } from '@/hooks/use-konami'

const RETRO_KEY = 'pf-retro'

function isRetro() {
  return document.documentElement.dataset.retro === 'true'
}

/**
 * Delight layer: typing the Konami code flips the site into a synthwave
 * "retro" palette (persisted in localStorage) with a toast confirmation.
 */
export function EasterEggs() {
  // Restore the retro mode on load if it was enabled previously.
  useEffect(() => {
    try {
      if (localStorage.getItem(RETRO_KEY) === '1' && !isRetro()) {
        document.documentElement.dataset.retro = 'true'
      }
    } catch {
      /* ignore */
    }
  }, [])

  useKonami(() => {
    const next = !isRetro()
    document.documentElement.dataset.retro = next ? 'true' : 'false'
    try {
      localStorage.setItem(RETRO_KEY, next ? '1' : '0')
    } catch {
      /* ignore */
    }
    toast(next ? '🕹️ Konami unlocked — retro mode on!' : 'Retro mode off. Back to the future.', {
      description: next ? 'Hot pink & cyan, just like 1984.' : undefined,
      duration: 3200,
    })
  })

  return null
}
