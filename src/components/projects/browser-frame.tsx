import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Browser-chrome frame for project previews: traffic lights + a URL pill
 * above the "page". Makes cards read like product launches.
 */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col overflow-hidden bg-muted/40', className)}>
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-border/70 bg-background/70 px-3 py-1.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ef6b73]" />
          <span className="size-2.5 rounded-full bg-[#ffae57]" />
          <span className="size-2.5 rounded-full bg-[#bae67e]" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-muted/70 px-3 py-0.5 text-[0.7rem] text-muted-foreground">
          <Lock aria-hidden className="size-2.5 shrink-0" />
          <span className="truncate font-mono">{url}</span>
        </span>
        <span aria-hidden className="w-10" />
      </div>
      {/* Page area */}
      <div className="relative flex-1">{children}</div>
    </div>
  )
}
