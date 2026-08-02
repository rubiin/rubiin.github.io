'use client'

import { Suspense, lazy, useRef, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Download, Mail, PenLine, FolderGit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { Counter } from '@/components/animations/counter'
import { TextReveal } from '@/components/animations/text-reveal'
import { profile } from '@/data/profile'
import { siteConfig } from '@/data/site'

// Three.js is heavy — only load on pages that render the hero.
const HeroScene = lazy(() =>
  import('@/components/three/hero-scene').then((m) => ({ default: m.HeroScene })),
)

const ROLES = ['React Developer', 'TypeScript Advocate', 'Creative Developer']

const STATS = [
  { label: 'Years experience', to: 8 },
  { label: 'Projects shipped', to: 40 },
  { label: 'GitHub stars', to: 4000, suffix: '+' },
]

const CTAS: {
  label: string
  to: string
  icon: typeof Download
  variant: NonNullable<ComponentProps<typeof Button>['variant']>
}[] = [
  { label: 'View Resume', to: '/resume', icon: Download, variant: 'default' },
  { label: 'Projects', to: '/projects', icon: FolderGit2, variant: 'outline' },
  { label: 'Blog', to: '/blog', icon: PenLine, variant: 'ghost' },
  { label: 'Contact', to: '/contact', icon: Mail, variant: 'secondary' },
]

/** Hero container mouse parallax: translate children slightly toward cursor. */
function useMouseParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced) return
    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth: w, innerHeight: h } = window
      setOffset({
        x: (e.clientX / w - 0.5) * 2 * 10,
        y: (e.clientY / h - 0.5) * 2 * 10,
      })
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [reduced])

  return { ref, offset }
}

export function Hero() {
  const { ref, offset } = useMouseParallax()
  const reduced = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)

  // Rotate the role line every 2.4s.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <section className="relative flex min-h-[92svh] flex-col overflow-hidden">
      {/* Animated gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary/10 blur-3xl"
          animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-24 size-[24rem] rounded-full bg-accent/40 blur-3xl"
          animate={reduced ? undefined : { opacity: [0.4, 0.8, 0.4], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 size-[20rem] rounded-full bg-chart-1/10 blur-3xl"
          animate={reduced ? undefined : { opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 3D scene, behind content, lazy-loaded */}
      {!reduced && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-70 motion-reduce:hidden"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}

      {/* Content */}
      <div
        ref={ref}
        className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-6 px-4 pt-16 pb-12 sm:px-6"
      >
        {/* Availability badge */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Available for freelance
        </motion.div>

        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/0 via-background/40 to-background" />

        <TextReveal
          as="h1"
          text={profile.name}
          className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        />

        <div className="flex min-h-[2.5rem] items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="text-lg font-medium text-muted-foreground sm:text-xl"
            >
              {ROLES[roleIndex]}
              <span className="ml-2 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle" aria-hidden />
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {profile.shortBio}
        </motion.p>

        {/* CTAs — `to` typed as string: routes land in later tasks */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center gap-3"
        >
          {CTAS.map(({ label, to, icon: Icon, variant }, i) => (
            <MagneticButton key={label}>
              <Button
                asChild
                size="lg"
                variant={variant}
                className={i === 0 ? 'gap-2' : 'gap-2'}
              >
                <Link to={to}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              </Button>
            </MagneticButton>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.dl
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 grid grid-cols-3 gap-8"
        >
          {STATS.map(({ label, to, suffix }) => (
            <div key={label} className="flex flex-col">
              <dt className="order-2 text-xs text-muted-foreground">{label}</dt>
              <dd className="order-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                <Counter to={to} suffix={suffix ?? ''} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#what-i-do"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown className="size-5" />
      </motion.a>

      <span className="sr-only">{siteConfig.role}</span>
    </section>
  )
}
