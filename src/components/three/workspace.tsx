'use client'

import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Mesh } from 'three'
import { pointerState } from '@/components/three/pointer-state'

/**
 * Minimal dependency-free re-implementation of drei's <Float> — the scene's
 * only drei usage. Keeps the hero chunk to pure three.js + @react-three/fiber.
 * Faithful to drei's math: rotation oscillates ±rotationIntensity/8 (z at
 * /20) and the group bobs sin(t/4·speed)/10 × floatIntensity. The random
 * offset desynchronizes sibling floats, exactly like drei.
 */
function FloatGroup({
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
  children,
}: {
  speed?: number
  rotationIntensity?: number
  floatIntensity?: number
  children?: ReactNode
}) {
  const ref = useRef<Group>(null)
  const offset = useRef(Math.random() * 10000)

  useFrame((state) => {
    const group = ref.current
    if (!group) return
    const t = offset.current + state.clock.elapsedTime
    group.rotation.x = (Math.cos((t / 4) * speed) / 8) * rotationIntensity
    group.rotation.y = (Math.sin((t / 4) * speed) / 8) * rotationIntensity
    group.rotation.z = (Math.sin((t / 4) * speed) / 20) * rotationIntensity
    group.position.y = (Math.sin((t / 4) * speed) / 10) * floatIntensity
  })

  return <group ref={ref}>{children}</group>
}

/**
 * A floating stylized workspace: rounded monitor, keyboard plane, and a
 * glowing icosahedron that rotates toward the pointer and reacts to hover.
 */
export function Workspace() {
  const icosaRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const mesh = icosaRef.current
    if (!mesh) return
    // Slow idle spin.
    mesh.rotation.y += delta * 0.25
    // Track the window-level cursor (R3F's own pointer never fires: the
    // canvas sits behind the hero content).
    const targetX = pointerState.x * 0.35
    const targetY = pointerState.y * 0.25
    mesh.rotation.x = MathUtils.lerp(mesh.rotation.x, targetY, 0.04)
    mesh.position.x = MathUtils.lerp(mesh.position.x, targetX, 0.04)
    // Gentle breathing pulse so the object stays alive without hover events.
    const pulse = 1 + Math.sin(Date.now() * 0.0012) * 0.06
    const scale = MathUtils.lerp(mesh.scale.x, pulse, 0.05)
    mesh.scale.setScalar(scale)
  })

  return (
    <group>
      {/* Monitor */}
      <FloatGroup speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.2, 1.35, 0.08]} />
          <meshStandardMaterial color="#0f1b33" metalness={0.55} roughness={0.25} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 1.15, 0.045]}>
          <planeGeometry args={[2.02, 1.17]} />
          <meshBasicMaterial color="#64ffda" toneMapped={false} transparent opacity={0.9} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.06]} />
          <meshStandardMaterial color="#1d2d50" metalness={0.4} roughness={0.4} />
        </mesh>
      </FloatGroup>

      {/* Keyboard */}
      <FloatGroup speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, 0.06, 0.55]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[1.5, 0.07, 0.55]} />
          <meshStandardMaterial color="#233554" metalness={0.35} roughness={0.5} />
        </mesh>
      </FloatGroup>

      {/* Glowing icosahedron — tracks the window cursor */}
      <mesh ref={icosaRef} position={[-1.7, 0.9, -0.4]} castShadow>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#64ffda"
          emissive="#2aa79b"
          emissiveIntensity={0.55}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Small floating torus accent */}
      <FloatGroup speed={2} rotationIntensity={0.6} floatIntensity={0.7}>
        <mesh position={[1.7, 0.65, -0.5]} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.28, 0.09, 16, 40]} />
          <meshStandardMaterial color="#71afff" metalness={0.5} roughness={0.3} />
        </mesh>
      </FloatGroup>

      {/* Soft ground shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}
