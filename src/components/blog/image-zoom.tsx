'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Click-to-zoom image: opens a blurred lightbox with the image enlarged.
 * Keyboard (Esc) and close-button dismissible; labelled for screen readers.
 */
export function ImageZoom({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor-label="Zoom"
        aria-label={`Zoom image: ${alt || 'image'}`}
        className={cn('group relative block w-full overflow-hidden', className)}
      >
        <img src={src} alt={alt} className="size-full object-cover" />
        <span
          aria-hidden
          className="absolute right-2 bottom-2 rounded-full bg-background/70 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100"
        >
          <ZoomIn className="size-3.5" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-background/85 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              className="max-h-[86vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
              initial={{ scale: 0.92, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close zoom"
              className="absolute top-4 right-4 rounded-full border bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
