"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  children: ReactNode;
  /** max rotation in degrees */
  max?: number;
  scale?: number;
  /** soft light that follows the cursor (use on cards, not on artwork) */
  spotlight?: boolean;
  className?: string;
}

/** Tilts toward the mouse. Pure transform: it never paints over its children unless spotlight is on. */
export default function Tilt({ children, max = 6, scale = 1.02, spotlight = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    el.style.setProperty("--px", `${x * 100}%`);
    el.style.setProperty("--py", `${y * 100}%`);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group relative ${className}`}
    >
      {children}
      {spotlight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(380px circle at var(--px,50%) var(--py,50%), rgba(255,255,255,.09), transparent 60%)" }}
        />
      )}
    </motion.div>
  );
}
