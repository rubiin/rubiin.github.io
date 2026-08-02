import { Store } from '@tanstack/react-store'

export interface CommandState {
  open: boolean
}

export const commandStore = new Store<CommandState>({ open: false })

export function openCommandPalette() {
  commandStore.setState((s) => ({ ...s, open: true }))
}

export function closeCommandPalette() {
  commandStore.setState((s) => ({ ...s, open: false }))
}
