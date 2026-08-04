'use client'

import { ComponentProps, type Ref } from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  indicatorRef,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Optional ref to the fill element — lets callers animate it imperatively. */
  indicatorRef?: Ref<HTMLDivElement>
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
