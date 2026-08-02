import { Store } from '@tanstack/react-store'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function initialTheme(): Theme {
  if (typeof document === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const resolved = resolveTheme(theme)
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

export const themeStore = new Store<Theme>(initialTheme())

export function setTheme(theme: Theme) {
  themeStore.setState(() => theme)
  if (typeof document !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, theme)
  }
  applyTheme(theme)
}
