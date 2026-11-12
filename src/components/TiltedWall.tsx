"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { WallItem } from "@/lib/types";

/**
 * Original "tilted wall" background: a 3D-tilted plane of image columns that
 * scroll in alternating directions, steered slightly by the mouse.
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
  const cols = vw < 640 ? 5 : vw < 1100 ? 8 : 11;
  const gap = 10;
  const planeW = vw * 2.5;
  const planeH = vh * 2.5;
  const tile = Math.ceil((planeW - gap * (cols - 1)) / cols);
  const per = Math.min(16, Math.ceil(planeH / (tile + gap)) + 1);
  return { cols, tile, per, gap, speed: 34 };
}

export default function TiltedWall({ items }: { items: WallItem[] }) {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [order, setOrder] = useState<WallItem[]>([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const baseRx = useMotionValue(40);
  const baseRy = useMotionValue(16);
  // pressing anywhere pushes the whole wall away and tips it toward the press point, then it springs back
  const press = useMotionValue(0);
  const kx = useMotionValue(0);
  const ky = useMotionValue(0);
  const rx = useTransform([baseRx, press, ky], ([a, p, k]: number[]) => a + p * k * 6);
  const ry = useTransform([baseRy, press, kx], ([a, p, k]: number[]) => a - p * k * 6);
  const z = useTransform(press, [0, 1], [0, -190]);
  const scale = useTransform(press, [0, 1], [1, 1.05]);
  const transform = useMotionTemplate`translateZ(${z}px) scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(-20deg)`;

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const apply = () => {
      setLayout(compute());
      setOrder(shuffle(items));
    };
    apply();
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setLayout(compute()), 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onDown = (e: PointerEvent) => {
      kx.set((e.clientX / window.innerWidth - 0.5) * 2);
      ky.set((e.clientY / window.innerHeight - 0.5) * 2);
      animate(press, 1, { duration: 0.14, ease: "easeOut" });
    };
    const onUp = () => {
      animate(press, 0, { type: "spring", stiffness: 140, damping: 9 });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    const un1 = smx.on("change", (v) => baseRy.set(16 + v * 9));
    const un2 = smy.on("change", (v) => baseRx.set(40 - v * 7));
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      un1();
      un2();
    };
  }, [mx, my, smx, smy, baseRx, baseRy, press, kx, ky]);

  if (!layout || order.length === 0) return null;
  const { cols, tile, per, gap, speed } = layout;
  const cycle = per * (tile + gap);
  const duration = cycle / speed;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ perspective: 1600 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, delay: 0.4 }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 flex"
        style={{
          width: "250vw",
          height: "250vh",
          marginLeft: "-125vw",
          marginTop: "-125vh",
          gap,
          transform,
          transformStyle: "preserve-3d",
          filter: "saturate(.85)",
        }}
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
                        <Image src={it.src} alt="" fill sizes={`${tile}px`} className="object-cover" />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(75% 75% at 30% 25%, ${it.tint}cc, transparent 72%), linear-gradient(160deg, ${it.tint}66, ${it.tint}14)`,
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
