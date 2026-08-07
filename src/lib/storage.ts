// Namespaced, versioned keys so a future format change can migrate cleanly.
export const STORAGE_KEYS = {
  theme: 'pf:theme:v1',
  retro: 'pf:retro:v1',
  bootDone: 'pf:boot:v1',
} as const

export type StorageKey = keyof typeof STORAGE_KEYS

// Pre-v1 keys, migrated into the versioned keys on first read.
export const LEGACY_STORAGE_KEYS: Record<StorageKey, string> = {
  theme: 'theme',
  retro: 'pf-retro',
  bootDone: 'pf-boot-done',
}

const SESSION_KEYS = new Set<StorageKey>(['bootDone'])

function storeFor(key: StorageKey): Storage | null {
  if (typeof window === 'undefined') return null
  return SESSION_KEYS.has(key) ? window.sessionStorage : window.localStorage
}

// Reads the versioned key, transparently migrating a legacy value.
export function readStorage(key: StorageKey): string | null {
  const store = storeFor(key)
  if (!store) return null
  try {
    const versioned = store.getItem(STORAGE_KEYS[key])
    if (versioned !== null) return versioned
    const legacy = store.getItem(LEGACY_STORAGE_KEYS[key])
    if (legacy !== null) {
      store.setItem(STORAGE_KEYS[key], legacy)
      store.removeItem(LEGACY_STORAGE_KEYS[key])
    }
    return legacy
  } catch {
    return null
  }
}

// Writes the versioned key (no-op when storage is unavailable).
export function writeStorage(key: StorageKey, value: string): void {
  const store = storeFor(key)
  if (!store) return
  try {
    store.setItem(STORAGE_KEYS[key], value)
  } catch {
    /* storage unavailable — ignore */
  }
}
