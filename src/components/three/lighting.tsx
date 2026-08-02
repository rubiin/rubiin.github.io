'use client'

/**
 * Scene lighting: soft ambient plus two tinted point lights (a cool mint
 * primary and a blue secondary) to give the workspace depth.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 5, 4]} intensity={30} color="#64ffda" />
      <pointLight position={[-4, 2, -3]} intensity={24} color="#71afff" />
      <pointLight position={[0, -2, 3]} intensity={10} color="#ffffff" />
    </>
  )
}
