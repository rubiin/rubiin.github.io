/**
 * Shared normalized pointer state (-1..1). The hero writes it from a
 * window-level `pointermove` listener (the canvas sits behind page content,
 * so R3F's own pointer tracking never fires); the 3D scene reads it in
 * `useFrame`. Avoids per-mousemove React state churn.
 */
export const pointerState = { x: 0, y: 0 }

export function updatePointerState(clientX: number, clientY: number) {
  pointerState.x = (clientX / window.innerWidth - 0.5) * 2
  pointerState.y = (clientY / window.innerHeight - 0.5) * 2
}
