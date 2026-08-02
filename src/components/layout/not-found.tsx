import { Link } from '@tanstack/react-router'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, type CSSProperties, type ReactNode } from 'react'

/*
 * Parallax canyon 404 — adapted from ykadosh's CodePen (wvPOdmb).
 * The palette is derived from the site's design tokens (color-mix + CSS vars),
 * so the scene follows light/dark themes (and the konami retro override)
 * automatically. All layers translate with the pointer via Motion springs.
 */

const SKY = 'color-mix(in oklab, var(--foreground) 7%, var(--background))'
const RIDGE_FAR = 'color-mix(in oklab, var(--foreground) 14%, var(--background))'
const RIDGE_STROKE = 'color-mix(in oklab, var(--foreground) 32%, var(--background))'
const FLOOR = 'var(--background)'
const HAZE = 'color-mix(in oklab, var(--foreground) 12%, var(--background))'
const DIGITS_FILL = 'var(--muted-foreground)'
const DIGITS_GLOW =
  'drop-shadow(0 10px 50px color-mix(in oklab, var(--foreground) 16%, transparent))'
const CACTUS = 'var(--primary)'
const CACTUS_SHADE = 'color-mix(in oklab, var(--primary) 45%, var(--background))'
const CACTUS_DEEP = 'color-mix(in oklab, var(--primary) 18%, var(--background))'

const RIDGE_BACK =
  'm1831 198l-8 565l-95 3v-576.3zm-441-42v633.1h-257v-622.1zm-340 36v597.3h-201.7v-596.3zm-246 20v531.7h-53v-534.7zm-136-20v575.1h-153.4v-576.3zm-348 3v574.7h-159v-566.8z'
const GROUND =
  'm-203.5 227v-467.6h2433.1v553.6l-399.6-71l-102 29l-335-76l-258 80l-85-30l-202 32l-45-35l-50 19l-84-35l-154 61l-194-58l-160 58z'
const HAZE_PATH = 'm-300,400 H2400 V700 H0 z'
const RIDGE_FRONT =
  'm2195 396v531.1h-2437.2v-538.1l359.2 60l96-22l63 44l169-40l83 39l348-47l147 28l125-32l75 47l75-21l221 28l263-75l109 31z'

const CACTUS_BODY =
  'm276.5 542.8c0 0-51.3-1.1-86-35.8c-38.6-38.6-38.9-75.8-38.9-75.8v-94.2c0 0-0.3-27.7 28.6-27.7c28.9 0 28.7 27.7 28.7 27.7v69.6c0 0 2 22.9 19.5 44.1c17.4 21.1 49.1 19.4 49.1 19.4v-287.8c0 0 0.2-43.7 42-43.7c37.4 0 44.1 38.6 44.1 38.6v264.2c0 0 29.4-4.3 48.1-22.5c18.7-18.1 19.5-44 19.5-44v-103.5c0 0-2.5-31.2 27.3-31.2c28.2 0 29 27.1 29 27.1v130.1c0 0 1.5 40.8-38.9 79.4c-38.2 36.6-86.1 37.4-86.1 37.4v120.9c-14.2 1.9-28.7 2.9-43.5 2.9c-14.1 0-28-0.9-41.6-2.7z'
const CACTUS_ARMS =
  'm330 139.3c15.4 3.9-12.7 14.1-18 29.7c-5.3 15.5-8 26-8 26v442.7q-13.7-0.7-27-2.4v-92.3c0 0-53.3-2.3-77-26c-49.3-49.3-48-81-48-81v-101c0 0 1.9-14.1 8-17c6.1-2.9 13-7 13-7c0 0-6.6 9-9 19c-2.4 10-1.6 77.9-1.6 99.7c0 21.8 17.5 47.3 39.1 65.4c31 26 74.5 26.9 74.5 26.9v-344c0 0 6.4-22.2 18.4-30.3c12-8.1 22.8-11.7 35.6-8.4zm33 351.7c0 0 13.5 1.7 54-14c50.9-19.8 71.2-79.5 71.2-79.5c0 0-8.4 51.7-43.2 83.5c-31.9 29.2-82 32-82 32zm97-250c0 0-8.2 5.1-13 19c-4.8 13.9-1.8 88.3-1.8 96.7c0 8.4-1.1 30.9-11.4 44c-12.4 15.7-24.1 19.5-24.1 19.5c0 0 9.3-4.9 14.3-18.2c5-13.3 6-24 6-24v-114c0 0 5.9-16.9 15-20c9.1-3.1 15-3 15-3z'
const CACTUS_SPINES =
  'm490.9 310.7v26.8h13.9c2.5 0 4.5 2 4.5 4.5c0 2.5-2 4.5-4.5 4.5h-13.9v26.7h13.9c2.5 0 4.5 2 4.5 4.5c0 2.5-2 4.5-4.5 4.5h-13.9v5.2q0 11.1-1.8 21.6h13.1c2.5 0 4.5 1.9 4.5 4.4c0 2.5-2 4.5-4.5 4.5h-14.9c-13.4 55.1-62.2 96.4-120.9 98.4v29.5h13.9c2.4 0 4.4 2 4.4 4.5c0 2.5-2 4.5-4.4 4.5h-13.9v26.7h13.9c2.4 0 4.4 2 4.4 4.5c0 2.5-2 4.5-4.4 4.5h-13.9v44q-4.4 0.7-8.9 1.2v-144.4c0-2.5 2-4.5 4.4-4.5c2.5 0 4.5 2 4.5 4.5v16.1c64.1-2.4 115.6-55.2 115.6-119.9v-119c0-13.3-10.8-24-24-24c-13.2 0-23.9 10.7-23.9 24v104.6c0 38.3-30 69.7-67.7 72v7.6c0 2.4-2 4.4-4.5 4.4c-2.4 0-4.4-2-4.4-4.4v-271.4c0-21.1-17.2-38.2-38.2-38.2c-21.1 0-38.2 17.1-38.2 38.2v301.8c0 2.5-2 4.5-4.5 4.5c-2.4 0-4.4-2-4.4-4.5v-8.2c-38.3-1.7-69-33.3-69-72v-64.9c0-13.2-10.7-24-23.9-24c-13.3 0-24 10.8-24 24v79.2c0 65.1 52.1 118.3 116.9 120v-18.4c0-2.4 2-4.4 4.4-4.4c2.5 0 4.5 2 4.5 4.4v117q-4.5-0.5-8.9-1.2v-20.3h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.5 2-4.5 4.5-4.5h13.9v-23.5c-58.6-1.4-107.6-42-121.7-96.5h-18c-2.5 0-4.5-2-4.5-4.4c0-2.5 2-4.5 4.5-4.5h16c-1.4-7.6-2.1-15.5-2.1-23.5v-3.3h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h14.2c2.2-16.1 15.9-28.5 32.6-28.5c18.1 0 32.8 14.8 32.8 32.9v2.5h13.9c2.5 0 4.5 2 4.5 4.5c0 2.4-2 4.4-4.5 4.4h-13.9v26.8h13.9c2.5 0 4.5 2 4.5 4.5c0 2.4-2 4.4-4.5 4.4h-13.9v17.8c0 33.7 26.7 61.3 60.1 63v-30.2h-13.9c-2.5 0-4.5-2-4.5-4.4c0-2.5 2-4.5 4.5-4.5h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.4c0-2.5 2-4.5 4.5-4.5h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.4c0-2.5 2-4.5 4.5-4.5h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.4 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.5 2-4.4 4.5-4.4h13.9v-26.8h-13.9c-2.5 0-4.5-2-4.5-4.5c0-2.5 2-4.5 4.5-4.5h14.1c2.2-23.9 22.4-42.6 46.9-42.6c26 0 47.1 21.1 47.1 47.1v13.4h13.9c2.4 0 4.4 2 4.4 4.5c0 2.4-2 4.4-4.4 4.4h-13.9v26.8h13.9c2.4 0 4.4 2 4.4 4.5c0 2.4-2 4.4-4.4 4.4h-13.9v26.8h13.9c2.4 0 4.4 2 4.4 4.5c0 2.4-2 4.4-4.4 4.4h-13.9v26.8h13.9c2.4 0 4.4 2 4.4 4.5c0 2.5-2 4.5-4.4 4.5h-13.9v26.7h13.9c2.4 0 4.4 2 4.4 4.5c0 2.5-2 4.5-4.4 4.5h-13.9v26.7h13.9c2.4 0 4.4 2 4.4 4.5c0 2.5-2 4.5-4.4 4.5h-13.9v26.8h13.9c2.4 0 4.4 2 4.4 4.4c0 2.5-2 4.5-4.4 4.5h-13.9v18.2c32.8-2.3 58.7-29.7 58.7-63v-8.8h-13.9c-2.4 0-4.4-2-4.4-4.4c0-2.5 2-4.5 4.4-4.5h13.9v-26.8h-13.9c-2.4 0-4.4-2-4.4-4.5c0-2.4 2-4.4 4.4-4.4h13.9v-26.8h-13.9c-2.4 0-4.4-2-4.4-4.5c0-2.4 2-4.4 4.4-4.4h13.9v-15.5c0-18.2 14.8-32.9 32.9-32.9c17.4 0 31.6 13.5 32.8 30.5h14c2.5 0 4.5 2 4.5 4.5c0 2.4-2 4.4-4.5 4.4h-13.9v26.8h13.9c2.5 0 4.5 2 4.5 4.5c0 2.5-2 4.5-4.5 4.5c0-0.1-13.9-0.1-13.9-0.1z'

type CactusSpec = [x: number, y: number, scale: number]

type CactusProps = {
  x: number
  y: number
  scale: number
}

const FAR_CACTI: CactusSpec[] = [
  [0, -350, 0.1],
  [300, -320, 0.1],
  [520, -360, 0.08],
  [800, -330, 0.1],
  [1000, -380, 0.08],
  [1150, -350, 0.1],
  [1400, -360, 0.1],
]
const MID_CACTI: CactusSpec[] = [
  [80, -300, 0.15],
  [380, -280, 0.15],
  [600, -310, 0.1],
  [700, -290, 0.15],
  [1100, -320, 0.1],
  [1250, -300, 0.15],
  [1500, -310, 0.15],
]
const NEAR_CACTI: CactusSpec[] = [
  [-110, -200, 0.2],
  [180, -180, 0.25],
  [800, -190, 0.2],
  [500, -230, 0.15],
  [1300, -220, 0.15],
  [1450, -200, 0.2],
]
const FRONT_CACTI: CactusSpec[] = [
  [0, 80, 0.4],
  [1000, 100, 0.45],
  [1450, 80, 0.4],
]
const BLUR_CACTI: CactusSpec[] = [
  [100, 180, 0.5],
  [700, 200, 0.55],
  [1350, 250, 0.5],
]
const DEEP_CACTI: CactusSpec[] = [
  [0, 320, 0.6],
  [400, 280, 0.65],
  [1400, 350, 0.6],
]

function Cactus({ x, y, scale }: CactusProps) {
  return (
    <g
      className="cactus"
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: 'center',
        transformBox: 'fill-box',
      }}
    >
      <path d={CACTUS_BODY} style={{ fill: CACTUS }} />
      <path d={CACTUS_ARMS} style={{ fill: CACTUS_SHADE }} />
      <path d={CACTUS_SPINES} style={{ fill: CACTUS_DEEP }} />
    </g>
  )
}

function Cacti({ specs, style }: { specs: CactusSpec[]; style?: CSSProperties }) {
  return (
    <g style={style}>
      {specs.map(([x, y, scale]) => (
        <Cactus key={x} x={x} y={y} scale={scale} />
      ))}
    </g>
  )
}

type ParallaxLayerProps = {
  x: MotionValue<number>
  y: MotionValue<number>
  depth: number
  children: ReactNode
  style?: CSSProperties
}

/** Translates its children by `depth` × normalized pointer position (spring-smoothed). */
function ParallaxLayer({ x, y, depth, children, style }: ParallaxLayerProps) {
  const tx = useTransform(x, (v) => v * depth)
  const ty = useTransform(y, (v) => v * depth)
  return <motion.g style={{ x: tx, y: ty, ...style }}>{children}</motion.g>
}

function Canyon() {
  const reduced = useReducedMotion()
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const sx = useSpring(nx, { stiffness: 80, damping: 22, mass: 0.5 })
  const sy = useSpring(ny, { stiffness: 80, damping: 22, mass: 0.5 })

  useEffect(() => {
    if (reduced) return
    const onPointerMove = (event: PointerEvent) => {
      nx.set(event.clientX / window.innerWidth - 0.5)
      ny.set(event.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [nx, ny, reduced])

  return (
    <svg
      viewBox="0 0 2000 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="w-full"
      style={{ background: SKY, overflow: 'visible' }}
    >
      {/* Back ridge + canyon floor */}
      <ParallaxLayer x={sx} y={sy} depth={-80}>
        <path style={{ fill: RIDGE_FAR, stroke: RIDGE_STROKE }} strokeWidth={5} d={RIDGE_BACK} />
        <path style={{ fill: FLOOR }} d={GROUND} />
      </ParallaxLayer>
      {/* Distant cacti */}
      <ParallaxLayer x={sx} y={sy} depth={-240}>
        <Cacti specs={FAR_CACTI} style={{ opacity: 0.2 }} />
      </ParallaxLayer>
      <ParallaxLayer x={sx} y={sy} depth={-150}>
        <Cacti specs={MID_CACTI} style={{ opacity: 0.4 }} />
      </ParallaxLayer>
      <ParallaxLayer x={sx} y={sy} depth={-80}>
        <Cacti specs={NEAR_CACTI} style={{ opacity: 0.7 }} />
      </ParallaxLayer>
      {/* Mist band behind the digits */}
      <ParallaxLayer x={sx} y={sy} depth={-80}>
        <path style={{ fill: HAZE, filter: 'blur(80px)' }} d={HAZE_PATH} />
      </ParallaxLayer>
      {/* Giant 404 */}
      <ParallaxLayer x={sx} y={sy} depth={-20}>
        <text
          x="1000"
          y="550"
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: 660,
            fill: DIGITS_FILL,
            filter: DIGITS_GLOW,
            userSelect: 'none',
          }}
        >
          404
        </text>
      </ParallaxLayer>
      {/* Foreground ridge + cacti */}
      <ParallaxLayer x={sx} y={sy} depth={80}>
        <path style={{ fill: FLOOR }} d={RIDGE_FRONT} />
        <Cacti specs={FRONT_CACTI} />
      </ParallaxLayer>
      <ParallaxLayer x={sx} y={sy} depth={150}>
        <Cacti specs={BLUR_CACTI} style={{ filter: 'blur(5px) brightness(0.7)' }} />
      </ParallaxLayer>
      <ParallaxLayer x={sx} y={sy} depth={300}>
        <Cacti specs={DEEP_CACTI} style={{ filter: 'blur(10px) brightness(0.5)' }} />
      </ParallaxLayer>
    </svg>
  )
}

/** Parallax canyon 404, used as the router-wide default not-found. */
export function NotFoundComponent() {
  return (
    <section className="relative flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center overflow-hidden px-4 py-10 text-center">
      <div className="relative z-10 mb-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Not Found</h1>
        <p className="mt-4 font-medium tracking-wide text-muted-foreground">
          Sorry, there&apos;s nothing to see here but cacti :(
        </p>
        <p className="mt-2 text-muted-foreground">
          You can{' '}
          <Link
            to="/"
            className="rounded-sm font-medium text-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:underline"
          >
            go back home
          </Link>
          , or{' '}
          <Link
            to="/blog"
            search={{ category: 'all', tag: 'all', q: '', page: 1 }}
            className="rounded-sm font-medium text-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:underline"
          >
            search for something
          </Link>
          .
        </p>
      </div>
      <Canyon />
    </section>
  )
}
