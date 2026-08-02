'use client'

import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/**
 * Live local clock — a quiet micro-detail for the footer. Updates every
 * second; cheap to run.
 */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className={className} suppressHydrationWarning>
      {now ? (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-1.5 rounded-full bg-primary animate-pulse" />
          <time dateTime={now.toISOString()} className="tabular-nums">
            {fmt.format(now)}
          </time>
        </span>
      ) : (
        <span className="tabular-nums">--:--:--</span>
      )}
    </span>
  )
}
