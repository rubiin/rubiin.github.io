import { Store } from '@tanstack/react-store'
import { readStorage, writeStorage } from '@/lib/storage'

/** Light/dark/system — picks which variant of the active palette renders. */
export type Mode = 'light' | 'dark' | 'system'

/** Color scheme applied on top of the mode via `data-theme` on <html>. */
export type Palette =
  | 'default'
  | 'catppuccin'
  | 'rosepine'
  | 'nord'
  | 'dracula'
  | 'tokyonight'
  | 'gruvbox'
  | 'everforest'

export interface ThemeState {
  mode: Mode
  palette: Palette
}

/** Registry of selectable palettes — swatches drive the PaletteToggle UI. */
export const PALETTES: { value: Palette; label: string; swatch: [string, string, string] }[] = [
  { value: 'default', label: 'Default', swatch: ['#5b8cff', '#a78bfa', '#22d3ee'] },
  { value: 'catppuccin', label: 'Catppuccin', swatch: ['#89b4fa', '#cba6f7', '#a6e3a1'] },
  { value: 'rosepine', label: 'Rosé Pine', swatch: ['#eb6f92', '#c4a7e7', '#9ccfd8'] },
  { value: 'nord', label: 'Nord', swatch: ['#88c0d0', '#81a1c1', '#a3be8c'] },
  { value: 'dracula', label: 'Dracula', swatch: ['#ff79c6', '#bd93f9', '#8be9fd'] },
  { value: 'tokyonight', label: 'Tokyo Night', swatch: ['#7aa2f7', '#bb9af7', '#9ece6a'] },
  { value: 'gruvbox', label: 'Gruvbox', swatch: ['#83a598', '#fb4934', '#b8bb26'] },
  { value: 'everforest', label: 'Everforest', swatch: ['#7fbbb3', '#a7c080', '#d699b6'] },
]

const PALETTE_VALUES = new Set<string>(PALETTES.map((p) => p.value))

function initialMode(): Mode {
  if (typeof document === 'undefined') return 'system'
  const stored = readStorage('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function initialPalette(): Palette {
  if (typeof document === 'undefined') return 'default'
  const stored = readStorage('palette')
  return stored && PALETTE_VALUES.has(stored) ? (stored as Palette) : 'default'
}

function resolveMode(mode: Mode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export function applyTheme({ mode, palette }: ThemeState) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const resolved = resolveMode(mode)
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
  if (palette === 'default') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', palette)
  }
}

export const themeStore = new Store<ThemeState>({
  mode: initialMode(),
  palette: initialPalette(),
})

export function setMode(mode: Mode) {
  const state = { ...themeStore.state, mode }
  themeStore.setState(() => state)
  if (typeof document !== 'undefined') {
    writeStorage('theme', mode)
  }
  applyTheme(state)
}

export function setPalette(palette: Palette) {
  const state = { ...themeStore.state, palette }
  themeStore.setState(() => state)
  if (typeof document !== 'undefined') {
    writeStorage('palette', palette)
  }
  applyTheme(state)
}
