import { useStore } from '@tanstack/react-store'
import { setMode, setPalette, themeStore } from '@/stores/theme-store'

export function useTheme() {
  const { mode, palette } = useStore(themeStore)
  return { mode, palette, setMode, setPalette }
}
