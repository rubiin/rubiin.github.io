"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Cursor trail: tiny particles emitted along the pointer's path, drawn on
 * a full-viewport canvas. Pooled (fixed max), one rAF loop, emission is
 * distance-based so fast swipes don't dump a solid line of particles.
 * Disabled for reduced motion and coarse pointers; pauses when the tab is
 * hidden or the pointer sits still (particles drain, then the loop idles
 * on zero work).
 *
 * Colors are read from CSS custom properties so light/dark themes both
 * work; re-read on theme change via a `transitionend`-free interval.
 */

const MAX_PARTICLES = 160;
const EMISSION_GAP = 8; // px of travel between emissions
const PARTICLE_LIFE = 0.55; // seconds

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    if (fine && hover && !reduced) setEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const themeColors = (): string[] => {
      const styles = getComputedStyle(document.documentElement);
      const pick = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;
      return [
        pick("--primary", "#8b5cf6"),
        pick("--accent-secondary", "#22d3ee"),
        pick("--chart-3", "#f59e0b"),
      ];
    };

    let colors = themeColors();
    // Re-read theme colors occasionally (theme toggles don't emit events we
    // can hook cheaply; a 2s interval costs nothing).
    const colorTimer = window.setInterval(() => {
      colors = themeColors();
    }, 2000);

    const pool: Particle[] = [];
    const active: Particle[] = [];

    const spawn = (x: number, y: number, vx: number, vy: number) => {
      if (active.length >= MAX_PARTICLES) {
        // At capacity: recycle the oldest particle instead of growing.
        const oldest = active.shift();
        if (oldest) pool.push(oldest);
      }
      const p =
        pool.pop() ??
        ({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: PARTICLE_LIFE,
          size: 2,
          color: "",
        } as Particle);
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 18;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed + vx * 0.15;
      p.vy = Math.sin(angle) * speed + vy * 0.15;
      p.maxLife = PARTICLE_LIFE * (0.6 + Math.random() * 0.8);
      p.life = p.maxLife;
      p.size = 1 + Math.random() * 2;
      p.color = colors[(Math.random() * colors.length) | 0] ?? colors[0]!;
      active.push(p);
    };

    let lastX = -1;
    let lastY = -1;
    let travel = 0;
    let pointerVX = 0;
    let pointerVY = 0;

    const onMove = (e: PointerEvent) => {
      if (lastX < 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      pointerVX = dx;
      pointerVY = dy;
      travel += Math.hypot(dx, dy);
      while (travel >= EMISSION_GAP) {
        travel -= EMISSION_GAP;
        spawn(
          lastX + (dx * travel) / Math.hypot(dx, dy),
          lastY + (dy * travel) / Math.hypot(dx, dy),
          pointerVX,
          pointerVY,
        );
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let lastTime = performance.now();
    let idle = false;

    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (active.length === 0 && travel === 0) {
        if (!idle) {
          idle = true;
          ctx.clearRect(0, 0, width, height);
        }
        raf = requestAnimationFrame(frame);
        return;
      }
      idle = false;

      ctx.clearRect(0, 0, width, height);
      for (let i = active.length - 1; i >= 0; i--) {
        const p = active[i]!;
        p.life -= dt;
        if (p.life <= 0) {
          active.splice(i, 1);
          pool.push(p);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) return;
      // Tab became visible again: reset the clock so the first frame's dt
      // doesn't teleport particles.
      lastTime = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(colorTimer);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      ctx.clearRect(0, 0, width, height);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[99] overflow-hidden"
    />
  );
}
