'use client'

import { useState } from 'react'

/**
 * Returns the desired route-preload mode — unless the user has data-saver
 * enabled (`navigator.connection.saveData`), in which case prefetching would
 * waste their bandwidth and returns `false`. TanStack Router has no built-in
 * gate for this, so passive prefetch opt-ins (e.g. `preload="viewport"`)
 * should go through here. Deliberate hover/touch prefetch (`'intent'`) is
 * not gated — the user is already engaging with the link.
 */
export function usePrefetchMode(mode: 'viewport' | 'intent' = 'viewport') {
  const [saveData] = useState(() => {
    if (typeof navigator === 'undefined') return false
    // Network Information API is not in the default TS DOM lib.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean }
      }
    ).connection
    return connection?.saveData === true
  })
  return saveData ? false : mode
}
