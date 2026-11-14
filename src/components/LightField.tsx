"use client";
import { useEffect, useRef } from "react";

/**
 * A dark veil over the wall with one hole cut out of it: the mouse is a soft light
 * source that reveals the artwork under it. Half-resolution canvas, and it only
 * redraws while the light is actually moving.
 */
const SCALE = 0.5;
const BASE_DARK = 0.85;   // how dark the room is without light
const SPOT_RADIUS = 340;  // px

export default function LightField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, last = performance.now(), lastDraw = 0;
    let tx = window.innerWidth * 0.5, ty = window.innerHeight * 0.42; // target
    let cx = tx, cy = ty;                                              // smoothed light position
    let hasPointer = false, dirty = true;

    const resize = () => {
      w = Math.max(1, Math.round(window.innerWidth * SCALE));
      h = Math.max(1, Math.round(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      dirty = true;
    };
    resize();

    const onMove = (e: PointerEvent) => { hasPointer = true; tx = e.clientX; ty = e.clientY; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(8,12,24,${BASE_DARK})`;
      ctx.fillRect(0, 0, w, h);

      const R = SPOT_RADIUS * SCALE;
      const x = cx * SCALE, y = cy * SCALE;
      ctx.globalCompositeOperation = "destination-out";
      let g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, "rgba(0,0,0,.92)");
      g.addColorStop(0.35, "rgba(0,0,0,.62)");
      g.addColorStop(0.7, "rgba(0,0,0,.2)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "source-over";
      g = ctx.createRadialGradient(x, y, 0, x, y, R * 0.8);
      g.addColorStop(0, "rgba(143,162,255,.12)");
      g.addColorStop(1, "rgba(143,162,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const frame = () => {
      const now = performance.now();
      try {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!hasPointer && !reduced) {
          // no mouse (phones, first moments): the light drifts slowly, at ~30fps
          const t = now / 1000;
          tx = window.innerWidth * (0.5 + 0.28 * Math.sin(t * 0.35));
          ty = window.innerHeight * (0.45 + 0.22 * Math.cos(t * 0.27));
          if (now - lastDraw < 33) return;
        }
        const k = 1 - Math.exp(-dt * 11);
        cx += (tx - cx) * k;
        cy += (ty - cy) * k;
        const moving = Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4;
        if (moving || dirty) {
          draw();
          lastDraw = now;
          dirty = false;
        }
      } catch {
        /* a single bad frame must never stop the light */
      } finally {
        raf = requestAnimationFrame(frame);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
