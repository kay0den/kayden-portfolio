"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { WallItem } from "@/lib/types";

/**
 * Original "tilted wall" background: a 3D-tilted plane of image columns that
 * scroll in alternating directions, steered slightly by the mouse position.
 * (Built from scratch; it is NOT the paid React Bits Pro "Tilted Tiles" source.)
 */
interface Layout { cols: number; tile: number; per: number; gap: number; speed: number }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function compute(): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cols = vw < 640 ? 4 : vw < 1100 ? 6 : 8; // fewer, larger tiles = fewer nodes to paint
  const gap = 10;
  const planeW = vw * 2.5;
  const planeH = vh * 2.5;
  const tile = Math.ceil((planeW - gap * (cols - 1)) / cols);
  const per = Math.min(14, Math.ceil(planeH / (tile + gap)) + 1);
  return { cols, tile, per, gap, speed: 30 };
}

export default function TiltedWall({ items }: { items: WallItem[] }) {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [order, setOrder] = useState<WallItem[]>([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const rx = useMotionValue(40);
  const ry = useMotionValue(16);
  const transform = useMotionTemplate`rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(-20deg)`;

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    // measured and shuffled in the browser only (needs window + randomness)
    const first = requestAnimationFrame(() => {
      setLayout(compute());
      setOrder(shuffle(items));
    });
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setLayout(compute()), 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(first);
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // no mouse, no parallax
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    const un1 = smx.on("change", (v) => ry.set(16 + v * 9));
    const un2 = smy.on("change", (v) => rx.set(40 - v * 7));
    return () => {
      window.removeEventListener("pointermove", onMove);
      un1();
      un2();
    };
  }, [mx, my, smx, smy, rx, ry]);

  if (!layout || order.length === 0) return null;
  const { cols, tile, per, gap, speed } = layout;
  const cycle = per * (tile + gap);
  const duration = cycle / speed;
  const imgSizes = `${Math.min(tile, 384)}px`;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ perspective: 1600 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.3 }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 flex"
        style={{ width: "250vw", height: "250vh", marginLeft: "-125vw", marginTop: "-125vh", gap, transform }}
      >
        {Array.from({ length: cols }, (_, c) => {
          const down = c % 2 === 1;
          return (
            <div key={c} className="h-full overflow-hidden" style={{ width: tile }}>
              <div
                className="will-change-transform"
                style={{
                  animation: `${down ? "wall-down" : "wall-up"} ${duration}s linear infinite`,
                  animationDelay: `-${(c * 0.37 * duration) % duration}s`,
                }}
              >
                {Array.from({ length: per * 2 }, (_, k) => {
                  const it = order[(c * 5 + (k % per) * 3) % order.length];
                  return (
                    <div key={k} className="relative overflow-hidden rounded-md" style={{ height: tile, marginBottom: gap }}>
                      {it.src ? (
                        <Image src={it.src} alt="" fill sizes={imgSizes} className="object-cover" decoding="async" />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(70% 70% at 30% 25%, ${it.tint}cc, transparent 70%), linear-gradient(160deg, ${it.tint}55, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
