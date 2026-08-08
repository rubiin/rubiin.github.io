'use client'

import { useEffect } from 'react'
import { useKonami } from '@/hooks/use-konami'
import { useToast } from '@/hooks/use-toast'
import { readStorage, writeStorage } from '@/lib/storage'

function isRetro() {
  return document.documentElement.dataset.retro === 'true'
}

/**
 * Delight layer: typing the Konami code flips the site into a synthwave
 * "retro" palette (persisted in localStorage) with a toast confirmation.
 */
export function EasterEggs() {
  const { toast } = useToast()

  // Restore the retro mode on load if it was enabled previously.
  useEffect(() => {
    if (readStorage('retro') === '1' && !isRetro()) {
      document.documentElement.dataset.retro = 'true'
    }
  }, [])

  useKonami(() => {
    const next = !isRetro()
    document.documentElement.dataset.retro = next ? 'true' : 'false'
    writeStorage('retro', next ? '1' : '0')
    toast({
      title: next ? '🕹️ Konami unlocked — retro mode on!' : 'Retro mode off. Back to the future.',
      description: next ? 'Hot pink & cyan, just like 1984.' : undefined,
      duration: 3200,
    })
  })

  return null
}
