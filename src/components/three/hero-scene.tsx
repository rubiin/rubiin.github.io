'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Lighting } from '@/components/three/lighting'
import { Particles } from '@/components/three/particles'
import { Workspace } from '@/components/three/workspace'

/**
 * The hero's 3D workspace scene. Kept as its own client module so routes
 * can lazy-load it (`lazy(() => import(...))`) — Three.js only mounts on
 * pages that opt in. Suspense wraps the geometry (drei Float suspends).
 */
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Lighting />
        <Workspace />
        <Particles />
      </Suspense>
    </Canvas>
  )
}
