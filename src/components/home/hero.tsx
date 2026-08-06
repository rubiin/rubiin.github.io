'use client'

import { Suspense, lazy, useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import {
  ArrowDown,
  Atom,
  Braces,
  Cloud,
  Container,
  Database,
  Download,
  FolderGit2,
  Mail,
  Server,
  TerminalSquare,
} from 'lucide-react'
import { Counter } from '@/components/animations/counter'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { NeonButton } from '@/components/animations/neon-button'
import { TextReveal } from '@/components/animations/text-reveal'
import { AnimatedBorder } from '@/components/animations/animated-border'
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

/** Floating tech chips orbiting the portrait — decorative, CSS-driven float. */
const FLOATING_TECH = [
  { icon: Braces, label: 'TypeScript', className: '-top-6 -left-6 sm:-left-10', delay: '0s' },
  { icon: Atom, label: 'React', className: '-top-3 right-0 sm:right-4', delay: '1.4s' },
  { icon: Server, label: 'NestJS', className: 'top-[38%] -right-9 sm:-right-12', delay: '2.2s' },
  { icon: Database, label: 'PostgreSQL', className: '-bottom-7 left-2', delay: '0.7s' },
  { icon: Container, label: 'Docker', className: '-bottom-5 -left-8 sm:-left-12', delay: '1.8s' },
  { icon: Cloud, label: 'AWS', className: 'right-8 -bottom-3', delay: '2.8s' },
  { icon: TerminalSquare, label: 'Linux', className: '-left-8 top-1/4 sm:-left-14', delay: '3.4s' },
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
    let raf = 0
    const onPointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        updatePointerState(clientX, clientY)
        if (!layerRef.current) return
        const { innerWidth: w, innerHeight: h } = window
        const x = (clientX / w - 0.5) * 2 * 10
        const y = (clientY / h - 0.5) * 2 * 10
        layerRef.current.style.transform = `translate(${x}px, ${y}px)`
      })
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [reduced])

  return { layerRef }
}

/** Rotating role line with a blinking caret. */
function RotatingRole() {
  const reduced = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [reduced])

  return (
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
          <span className="text-gradient">{ROLES[roleIndex]}</span>
          <span
            className="ml-2 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle"
            aria-hidden
          />
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/** Glowing portrait placeholder with orbiting tech chips. */
function PortraitPlaceholder() {
  const nameInitials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="relative mx-auto mt-16 w-fit lg:mt-0">
      {/* Breathing glow behind the ring */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/40 to-accent-secondary/40 blur-3xl motion-reduce:animate-none animate-[pulse-glow_6s_ease-in-out_infinite]"
      />

      {/* Slowly rotating dashed orbit */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full border border-dashed border-primary/20 motion-reduce:animate-none animate-spin [animation-duration:45s]"
      />

      {/* Portrait ring */}
      <AnimatedBorder always className="relative size-56 rounded-full sm:size-64">
        <div className="flex size-full flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-b from-card/70 to-card/20 backdrop-blur-sm">
          <span className="font-display text-6xl font-bold tracking-tight text-gradient sm:text-7xl">
            {nameInitials}
          </span>
          <span className="text-[0.65rem] font-medium tracking-[0.35em] text-muted-foreground uppercase">
            {siteConfig.role}
          </span>
        </div>
      </AnimatedBorder>

      {/* Floating tech chips */}
      {FLOATING_TECH.map(({ icon: Icon, label, className, delay }) => (
        <span
          key={label}
          aria-hidden
          className={`glass absolute flex size-11 items-center justify-center rounded-2xl text-primary motion-reduce:animate-none animate-[float-y_5s_ease-in-out_infinite] ${className}`}
          style={{ animationDelay: delay }}
        >
          <Icon className="size-5" />
        </span>
      ))}
    </div>
  )
}

export function Hero() {
  const { layerRef } = useMouseParallax()
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    const enable = () => setSceneReady(true)
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(enable, { timeout: 3000 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(enable, 3000)
    return () => clearTimeout(id)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  // Scroll-scrubbed exit: as the hero scrolls away, the headline column
  // drifts up, shrinks, and fades — dissolving into the marquee below.
  // Static transforms for reduced motion (plain document-flow exit).
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -110])
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], reduced ? [1, 1] : [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 0.97])
  // Portrait trails at its own slower rate for depth.
  const portraitY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -60])
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.6], reduced ? [1, 1] : [1, 0])
  // Scroll indicator fades away early, once scrolling starts.
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.25], reduced ? [1, 1] : [1, 0])

  return (
    <section ref={sectionRef} className="relative flex min-h-[92svh] flex-col overflow-hidden">
      {/* Animated gradient blobs + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_10%,transparent_70%)]" />
        <motion.div
          className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary/10 blur-3xl"
          animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-24 size-[24rem] rounded-full bg-accent-secondary/15 blur-3xl"
          animate={reduced ? undefined : { opacity: [0.4, 0.8, 0.4], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 size-[20rem] rounded-full bg-chart-3/10 blur-3xl"
          animate={reduced ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 3D scene, behind content, lazy-loaded and deferred until idle */}
      {sceneReady && !reduced && (
        <motion.div
          ref={layerRef}
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{ opacity: sceneOpacity, scale: sceneScale }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-4 pt-16 pb-12 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <motion.div
          style={{ y: textY, opacity: textOpacity, scale: textScale }}
          className="flex flex-col items-start gap-6"
        >
          {/* Availability badge */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Available for freelance
          </motion.div>

          <TextReveal
            as="h1"
            text={profile.name.split(' ').join('\n')}
            className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            lineClassNames={['', 'text-gradient']}
          />

          <RotatingRole />

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {profile.shortBio}
          </motion.p>

          {/* CTAs — magnetic pull + spring scale + ripple + particle burst */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center gap-3"
          >
            <MagneticButton>
              <NeonButton href={siteConfig.resumePdfUrl} size="lg" download>
                <Download className="size-4" />
                Download Resume
              </NeonButton>
            </MagneticButton>
            <MagneticButton>
              <NeonButton to="/projects" size="lg" variant="outline">
                <FolderGit2 className="size-4" />
                Projects
              </NeonButton>
            </MagneticButton>
            <MagneticButton>
              <NeonButton to="/contact" size="lg" variant="ghost">
                <Mail className="size-4" />
                Contact
              </NeonButton>
            </MagneticButton>
          </motion.div>

          {/* Stats row */}
          <motion.dl
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-4 grid grid-cols-3 gap-8"
          >
            {STATS.map(({ label, to, suffix }) => (
              <div key={label} className="flex flex-col">
                <dt className="order-2 text-xs text-muted-foreground">{label}</dt>
                <dd className="order-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  <Counter to={to} suffix={suffix ?? ''} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Portrait column — scroll-driven drift/fade wrapper + entrance */}
        <motion.div style={{ y: portraitY, opacity: portraitOpacity }} className="relative">
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <PortraitPlaceholder />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: indicatorOpacity }}
      >
        <ArrowDown className="size-5" />
      </motion.a>

      <span className="sr-only">{siteConfig.role}</span>
    </section>
  )
}
