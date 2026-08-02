'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A floating stylized workspace: rounded monitor, keyboard plane, and a
 * glowing icosahedron that rotates toward the pointer and reacts to hover.
 */
export function Workspace() {
  const icosaRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    const mesh = icosaRef.current
    if (!mesh) return
    // Slow idle spin.
    mesh.rotation.y += delta * 0.25
    // Drift toward the pointer.
    const targetX = state.pointer.x * 0.35
    const targetY = state.pointer.y * 0.25
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetY, 0.04)
    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 0.04)
    const s = hovered ? 1.18 : 1
    const scale = THREE.MathUtils.lerp(mesh.scale.x, s, 0.08)
    mesh.scale.setScalar(scale)
  })

  return (
    <group>
      {/* Monitor */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.2, 1.35, 0.08]} />
          <meshStandardMaterial color="#1e1b2e" metalness={0.55} roughness={0.25} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 1.15, 0.045]}>
          <planeGeometry args={[2.02, 1.17]} />
          <meshBasicMaterial color="#8b5cf6" toneMapped={false} transparent opacity={0.92} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.06]} />
          <meshStandardMaterial color="#312e46" metalness={0.4} roughness={0.4} />
        </mesh>
      </Float>

      {/* Keyboard */}
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, 0.06, 0.55]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[1.5, 0.07, 0.55]} />
          <meshStandardMaterial color="#3b3554" metalness={0.35} roughness={0.5} />
        </mesh>
      </Float>

      {/* Glowing icosahedron — interactive */}
      <mesh
        ref={icosaRef}
        position={[-1.7, 0.9, -0.4]}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={hovered ? 1.1 : 0.55}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Small floating torus accent */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.7}>
        <mesh position={[1.7, 0.65, -0.5]} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.28, 0.09, 16, 40]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.3} />
        </mesh>
      </Float>

      {/* Soft ground shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}
