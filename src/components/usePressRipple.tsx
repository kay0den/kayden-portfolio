"use client";
import { useCallback, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Ripple { id: number; x: number; y: number; size: number }

/**
 * Press feedback that lives INSIDE the pressed element: a soft wave that expands from the
 * exact click point and fades out. Attach `onPointerDown` to the element and render `layer` inside it.
 */
export function usePressRipple(color = "rgba(143,162,255,.35)"): {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  layer: ReactNode;
} {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const size = Math.hypot(r.width, r.height) * 2;
    setRipples((a) => [...a, { id, x: e.clientX - r.left, y: e.clientY - r.top, size }]);
    setTimeout(() => setRipples((a) => a.filter((x) => x.id !== id)), 900);
  }, []);

  const layer = (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            background: `radial-gradient(circle, ${color} 0%, transparent 62%)`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );

  return { onPointerDown, layer };
}
