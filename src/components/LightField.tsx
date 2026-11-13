"use client";
import { useEffect, useRef } from "react";

/**
 * A dark veil over the wall with holes cut out of it:
 *  - the mouse is a soft light source that reveals the artwork under it
 *  - every click sends a ring of light expanding from the pointer
 * Drawn on one half-resolution canvas (soft gradients, so it stays sharp enough and cheap).
 */
const SCALE = 0.5;
const BASE_DARK = 0.85;         // how dark the room is without light
const SPOT_RADIUS = 340;        // px
const WAVE_MS = 2700;
const MAX_WAVES = 4;

interface Wave { x: number; y: number; t0: number }

export default function LightField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, last = performance.now();
    let tx = window.innerWidth * 0.5, ty = window.innerHeight * 0.42; // target
    let cx = tx, cy = ty;                                              // smoothed light position
    let hasPointer = false, down = false, press = 0;
    const waves: Wave[] = [];

    const resize = () => {
      w = Math.max(1, Math.round(window.innerWidth * SCALE));
      h = Math.max(1, Math.round(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const onMove = (e: PointerEvent) => { hasPointer = true; tx = e.clientX; ty = e.clientY; };
    const onDown = (e: PointerEvent) => {
      hasPointer = true; down = true; tx = e.clientX; ty = e.clientY;
      if (reduced) return;
      waves.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
      if (waves.length > MAX_WAVES) waves.shift();
    };
    const onUp = () => { down = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", resize);
    // fast clicking can start a native drag/selection, which silences pointer events: forbid it
    const noDrag = (e: Event) => e.preventDefault();
    window.addEventListener("dragstart", noDrag);

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
    const maxR = () => Math.hypot(window.innerWidth, window.innerHeight);

    const frame = () => {
      const now = performance.now(); // same clock as the click timestamps (rAF time can be earlier => negative radius)
      try {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // no mouse yet (phones, first second): the light drifts slowly on its own
      if (!hasPointer && !reduced) {
        const t = now / 1000;
        tx = window.innerWidth * (0.5 + 0.28 * Math.sin(t * 0.35));
        ty = window.innerHeight * (0.45 + 0.22 * Math.cos(t * 0.27));
      }
      const k = 1 - Math.exp(-dt * 11);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      press += ((down ? 1 : 0) - press) * (1 - Math.exp(-dt * 9));

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(8,12,24,${BASE_DARK})`;
      ctx.fillRect(0, 0, w, h);

      // light: erase darkness around the pointer
      const R = SPOT_RADIUS * (1 + press * 0.3) * SCALE;
      const x = cx * SCALE, y = cy * SCALE;
      ctx.globalCompositeOperation = "destination-out";
      let g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, "rgba(0,0,0,.92)");
      g.addColorStop(0.35, "rgba(0,0,0,.62)");
      g.addColorStop(0.7, "rgba(0,0,0,.2)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // light waves from clicks
      for (let i = waves.length - 1; i >= 0; i--) {
        const wv = waves[i];
        const p = Math.max(0, (now - wv.t0) / WAVE_MS);
        if (p >= 1) { waves.splice(i, 1); continue; }
        const r = Math.max(0, easeOut(p) * maxR() * SCALE);
        const th = (46 + 150 * p) * SCALE;
        const a = Math.pow(1 - p, 1.4);
        const wx = wv.x * SCALE, wy = wv.y * SCALE;
        const inner = Math.max(0, r - th);
        const ring = ctx.createRadialGradient(wx, wy, inner, wx, wy, r + th);
        ring.addColorStop(0, "rgba(0,0,0,0)");
        ring.addColorStop(0.55, `rgba(0,0,0,${1.0 * a})`);
        ring.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = ring;
        ctx.fillRect(0, 0, w, h);

        // faint trailing glow just behind the front, so the wave feels like it carries light
        const tail = ctx.createRadialGradient(wx, wy, 0, wx, wy, r);
        tail.addColorStop(0, "rgba(0,0,0,0)");
        tail.addColorStop(1, `rgba(0,0,0,${0.1 * a})`);
        ctx.fillStyle = tail;
        ctx.fillRect(0, 0, w, h);

        // coloured edge of the wave
        const edge = ctx.createRadialGradient(wx, wy, inner, wx, wy, r + th);
        edge.addColorStop(0, "rgba(143,162,255,0)");
        edge.addColorStop(0.55, `rgba(170,186,255,${0.42 * a})`);
        edge.addColorStop(1, "rgba(143,162,255,0)");
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, w, h);
      }

      // a hint of cool light colour at the source
      ctx.globalCompositeOperation = "source-over";
      g = ctx.createRadialGradient(x, y, 0, x, y, R * 0.8);
      g.addColorStop(0, "rgba(143,162,255,.12)");
      g.addColorStop(1, "rgba(143,162,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

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
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", resize);
      window.removeEventListener("dragstart", noDrag);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
