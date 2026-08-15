'use client'

import { Palette } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PALETTES } from '@/stores/theme-store'

export function PaletteToggle({ className, tooltip }: { className?: string; tooltip?: string }) {
  const { palette, setPalette } = useTheme()

  return (
    <DropdownMenu>
      {tooltip ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('size-9', className)}
                  aria-label="Choose color theme"
                >
                  <Palette className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('size-9', className)}
            aria-label="Choose color theme"
          >
            <Palette className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent align="end">
        {PALETTES.map(({ value, label, swatch }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setPalette(value)}
            className={cn(value === palette && 'font-medium text-primary')}
          >
            <span className="flex shrink-0 items-center gap-0.5" aria-hidden>
              {swatch.map((color) => (
                <span
                  key={color}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            {label}
            {value === palette && <span className="ml-auto sr-only">(active)</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
