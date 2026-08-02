'use client'

import { Suspense, lazy, useRef, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { ArrowDown, Download, Mail, PenLine, FolderGit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { Spotlight } from '@/components/animations/spotlight'
import { Counter } from '@/components/animations/counter'
import { TextReveal } from '@/components/animations/text-reveal'
import { profile } from '@/data/profile'
import { siteConfig } from '@/data/site'
import { updatePointerState } from '@/components/three/pointer-state'

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

/**
 * Mouse parallax: translates the 3D layer imperatively (no re-renders)
 * and feeds the normalized pointer into the scene so its objects can track
 * the cursor. Disabled for reduced motion.
 */
function useMouseParallax() {
  const layerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const onPointerMove = (e: PointerEvent) => {
      updatePointerState(e.clientX, e.clientY)
      if (!layerRef.current) return
      const { innerWidth: w, innerHeight: h } = window
      const x = (e.clientX / w - 0.5) * 2 * 10
      const y = (e.clientY / h - 0.5) * 2 * 10
      layerRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [reduced])

  return { layerRef }
}

export function Hero() {
  const { layerRef } = useMouseParallax()
  const reduced = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // Cinematic scroll-out: the 3D layer dims and pulls back as you scroll
  // into the content, handing off to the next section without a hard cut.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  // Rotate the role line every 2.4s.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <section ref={sectionRef} className="relative flex min-h-[92svh] flex-col overflow-hidden">
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

      {/* 3D scene, behind content, lazy-loaded; parallax via imperative ref */}
      {!reduced && (
        <motion.div
          ref={layerRef}
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ opacity: sceneOpacity, scale: sceneScale }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-6 px-4 pt-16 pb-12 sm:px-6">
        {/* Availability badge */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
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
          {CTAS.map(({ label, to, icon: Icon, variant }) => (
            <MagneticButton key={label}>
              <Spotlight className="rounded-md">
                <Button asChild size="lg" variant={variant} className="gap-2">
                  <Link to={to}>
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </Button>
              </Spotlight>
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
        href="#about"
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
