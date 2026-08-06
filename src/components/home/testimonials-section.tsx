'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'

/**
 * Auto-rotating glass testimonial carousel. Advances every 5.5s, pauses
 * while hovered or focused, and respects reduced motion (static first
 * slide).
 */
export function TestimonialsSection() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<number | null>(null)

  const count = testimonials.length

  useEffect(() => {
    if (reduced || paused || count <= 1) return
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 5500)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [reduced, paused, count])

  const go = (next: number) => setIndex((next + count) % count)
  // Static, non-empty data source — first entry is a safe fallback.
  const active = testimonials[index] ?? testimonials[0]!
  const initials = active.author
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <section id="testimonials" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-24 sm:px-6">
      <ChapterHeading
        chapter="05"
        eyebrow="Testimonials"
        title="Kind words from collaborators."
        description="A few things people have said about working together."
        align="center"
      />

      <div
        className="relative"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        // Pause for keyboard users too — focus stops the rotation.
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Ambient glow behind the card */}
        <div
          aria-hidden
          className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-accent-secondary/15 blur-2xl"
        />

        <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <Quote
            aria-hidden
            className="absolute top-8 right-8 size-10 rotate-180 text-primary/20"
          />

          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[16rem] flex-col justify-between gap-8 sm:min-h-[14rem]"
            >
              <blockquote className="text-lg leading-relaxed font-medium tracking-tight text-balance sm:text-xl">
                “{active.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-secondary font-display text-sm font-bold text-primary-foreground shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
                >
                  {initials}
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-sm font-semibold">{active.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {active.role} · {active.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="glass flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_18px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t.author}
                type="button"
                aria-label={`Show testimonial ${i + 1} of ${count}: ${t.author}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index
                    ? 'w-8 bg-gradient-to-r from-primary to-accent-secondary shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_80%,transparent)]'
                    : 'w-3 bg-muted-foreground/25 hover:bg-muted-foreground/50',
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="glass flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_18px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
