/**
 * Versioned client-storage keys (client-localstorage-schema).
 *
 * Keys are namespaced with a schema version (`pf:<name>:v1`) so a future
 * format change can migrate or discard stale entries instead of guessing
 * from ambiguous names. Legacy unversioned keys are transparently migrated
 * into the versioned key on first read.
 */

export const STORAGE_KEYS = {
  theme: 'pf:theme:v1',
  retro: 'pf:retro:v1',
  bootDone: 'pf:boot:v1',
} as const

export type StorageKey = keyof typeof STORAGE_KEYS

/** Unversioned keys used before v1 — migrated on first read. */
export const LEGACY_STORAGE_KEYS: Record<StorageKey, string> = {
  theme: 'theme',
  retro: 'pf-retro',
  bootDone: 'pf-boot-done',
}

/** Which web storage each key lives in. */
const SESSION_KEYS = new Set<StorageKey>(['bootDone'])

function storeFor(key: StorageKey): Storage | null {
  if (typeof window === 'undefined') return null
  return SESSION_KEYS.has(key) ? window.sessionStorage : window.localStorage
}

/**
 * Read a value under the versioned key, migrating any legacy value into it
 * on first use (so existing users keep their settings, then the old key is
 * dropped). Returns `null` when unset or storage is unavailable.
 */
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

/** Write a value under the versioned key (no-op when storage is unavailable). */
export function writeStorage(key: StorageKey, value: string): void {
  const store = storeFor(key)
  if (!store) return
  try {
    store.setItem(STORAGE_KEYS[key], value)
  } catch {
    /* storage unavailable — ignore */
  }
}
