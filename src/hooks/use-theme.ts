import { useStore } from '@tanstack/react-store'
import { setTheme, themeStore } from '@/stores/theme-store'

export function useTheme() {
  const theme = useStore(themeStore)
  return { theme, setTheme }
}
