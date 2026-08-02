'use client'

import { useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { closeCommandPalette, commandStore, openCommandPalette } from '@/stores/command-store'

/**
 * Command palette state + keyboard shortcut (⌘K / Ctrl+K).
 * Bind once per app shell. Also closes on Escape handled by the dialog.
 */
export function useCommand() {
  const open = useStore(commandStore, (s) => s.open)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (!isCmdK) return
      e.preventDefault()
      if (commandStore.state.open) {
        closeCommandPalette()
      } else {
        openCommandPalette()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return { open, setOpen: (v: boolean) => (v ? openCommandPalette() : closeCommandPalette()) }
}
