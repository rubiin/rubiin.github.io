"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/**
 * Custom cursor accent: a small dot that tracks the pointer 1:1 plus a
 * trailing ring on a spring. The ring scales up over interactive elements.
 * Only renders for fine, hover-capable pointers — touch devices never see
 * it. Reduced motion keeps dot/ring (they aid pointing) but skips hover
 * scaling.
 *
 * Not a cursor *replacement*: the native cursor stays visible and this adds
 * an accent on top. `cursor: none` across a content site fights text inputs
 * and iframes for marginal payoff.
 *
 * All positioning runs on motion values — no React re-renders per move.
 */

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });
  // 0 = resting, 1 = over an interactive element. Springed for a smooth swell.
  const hovered = useMotionValue(0);
  const scale = useSpring(
    useTransform(hovered, (v) => 1 + v * 0.6),
    {
      stiffness: 400,
      damping: 30,
    },
  );

  // Gate on a real pointer: fine pointer AND hover-capable. Render only
  // after mount so SSR output stays clean.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    if (fine && hover) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      if (reduced) return;
      const target = e.target as Element | null;
      hovered.set(target?.closest?.(INTERACTIVE) ? 1 : 0);
    };

    // Off-window: park the cursor offscreen instead of leaving it frozen
    // at the last position.
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, reduced, x, y, hovered]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot: exact position, no spring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ x, y }}
      />
      {/* Ring: spring-lagged, swells over interactive elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50"
        style={{ x: ringX, y: ringY, scale }}
      />
    </>
  );
}
