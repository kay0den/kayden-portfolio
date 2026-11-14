"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { WallItem } from "@/lib/types";

/**
 * Original "tilted wall" background: a 3D-tilted plane of image columns that scroll in
 * alternating directions. Built to be cheap: static tilt (no mouse tracking), and the
 * columns pause as soon as the visitor scrolls past the first screen.
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

const PLANE = 2.2; // plane size in viewport widths/heights (smaller plane = less to rasterize)

function compute(): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cols = vw < 640 ? 4 : vw < 1100 ? 5 : 7;
  const gap = 10;
  const tile = Math.ceil((vw * PLANE - gap * (cols - 1)) / cols);
  const per = Math.min(12, Math.ceil((vh * PLANE) / (tile + gap)) + 1);
  return { cols, tile, per, gap, speed: 28 };
}

export default function TiltedWall({ items }: { items: WallItem[] }) {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [order, setOrder] = useState<WallItem[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const ready = layout !== null;

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

  // stop the columns when the wall is mostly hidden behind page content
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const update = () => { el.dataset.paused = window.scrollY > window.innerHeight * 0.9 ? "true" : "false"; };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ready]);

  if (!layout || order.length === 0) return null;
  const { cols, tile, per, gap, speed } = layout;
  const duration = (per * (tile + gap)) / speed;
  const imgSizes = `${Math.min(tile, 384)}px`;

  return (
    <div ref={root} className="wall-fade absolute inset-0 overflow-hidden" style={{ perspective: 1600 }}>
      <div
        className="absolute left-1/2 top-1/2 flex"
        style={{
          width: `${PLANE * 100}vw`,
          height: `${PLANE * 100}vh`,
          marginLeft: `${-PLANE * 50}vw`,
          marginTop: `${-PLANE * 50}vh`,
          gap,
          transform: "rotateX(40deg) rotateY(16deg) rotateZ(-20deg)",
        }}
      >
        {Array.from({ length: cols }, (_, c) => {
          const down = c % 2 === 1;
          return (
            <div key={c} className="h-full overflow-hidden" style={{ width: tile }}>
              <div
                className="wall-col will-change-transform"
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
                        <Image src={it.src} alt="" fill sizes={imgSizes} quality={60} className="object-cover" decoding="async" />
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
      </div>
    </div>
  );
}
