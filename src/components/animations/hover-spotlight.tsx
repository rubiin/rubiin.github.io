"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Hover spotlight: a radial highlight inside the wrapped card that follows
 * the pointer's position within the element. CSS-var driven (`--spot-x`,
 * `--spot-y`) and RAF-throttled; the gradient itself lives in
 * `.hover-spotlight` (globals.css). Purely decorative — the wrapper never
 * intercepts clicks. Pair with AnimatedBorder like so:
 *
 *   <HoverSpotlight className="h-full rounded-2xl">
 *     <AnimatedBorder>...</AnimatedBorder>
 *   </HoverSpotlight>
 */
export function HoverSpotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
      el.style.setProperty("--spot-o", "1");
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(raf.current);
    ref.current?.style.setProperty("--spot-o", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("hover-spotlight relative isolate", className)}
    >
      {children}
    </div>
  );
}
