'use client'

import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Mesh } from 'three'
import { pointerState } from '@/components/three/pointer-state'

// Dependency-free <Float> reimplementation (keeps drei out of the hero chunk).
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

// Floating monitor, keyboard, and an icosahedron tracking the window cursor.
export function Workspace() {
  const icosaRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const mesh = icosaRef.current
    if (!mesh) return
    mesh.rotation.y += delta * 0.25
    // Track the window cursor (R3F's own pointer never fires — canvas is behind content).
    const targetX = pointerState.x * 0.35
    const targetY = pointerState.y * 0.25
    mesh.rotation.x = MathUtils.lerp(mesh.rotation.x, targetY, 0.04)
    mesh.position.x = MathUtils.lerp(mesh.position.x, targetX, 0.04)
    // Breathing pulse keeps the object alive without hover events.
    const pulse = 1 + Math.sin(Date.now() * 0.0012) * 0.06
    const scale = MathUtils.lerp(mesh.scale.x, pulse, 0.05)
    mesh.scale.setScalar(scale)
  })

  return (
    <group>
      <FloatGroup speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.2, 1.35, 0.08]} />
          <meshStandardMaterial color="#0f1b33" metalness={0.55} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.15, 0.045]}>
          <planeGeometry args={[2.02, 1.17]} />
          <meshBasicMaterial color="#64ffda" toneMapped={false} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.06]} />
          <meshStandardMaterial color="#1d2d50" metalness={0.4} roughness={0.4} />
        </mesh>
      </FloatGroup>

      <FloatGroup speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, 0.06, 0.55]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[1.5, 0.07, 0.55]} />
          <meshStandardMaterial color="#233554" metalness={0.35} roughness={0.5} />
        </mesh>
      </FloatGroup>

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

      <FloatGroup speed={2} rotationIntensity={0.6} floatIntensity={0.7}>
        <mesh position={[1.7, 0.65, -0.5]} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.28, 0.09, 16, 40]} />
          <meshStandardMaterial color="#71afff" metalness={0.5} roughness={0.3} />
        </mesh>
      </FloatGroup>

      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}
