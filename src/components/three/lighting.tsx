'use client'

/**
 * Scene lighting: soft ambient plus two tinted point lights (a cool
 * primary and a warm accent) to give the workspace depth.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 5, 4]} intensity={28} color="#8b5cf6" />
      <pointLight position={[-4, 2, -3]} intensity={20} color="#f59e0b" />
      <pointLight position={[0, -2, 3]} intensity={10} color="#ffffff" />
    </>
  )
}
