"use client";
import { useEffect, useRef } from "react";

/**
 * A soft ring that trails the pointer. It grows over links/buttons and shows a label
 * over anything marked data-cursor="Open" (cards), data-cursor="View" (gallery) etc.
 * The normal cursor stays visible: this is an accent, not a replacement.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, shown = false;

    const set = (target: EventTarget | null) => {
      const t = target instanceof Element ? target : null;
      const txt = t?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null;
      const link = !!t?.closest("a,button,[role=button]");
      el.dataset.state = txt ? "label" : link ? "link" : "idle";
      if (label.current && txt) label.current.textContent = txt;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX; y = e.clientY;
      if (!shown) { cx = x; cy = y; shown = true; el.style.opacity = "1"; }
      set(e.target);
    };
    // scrolling moves content under a still mouse: re-evaluate what is under it
    const refresh = () => { if (shown) set(document.elementFromPoint(x, y)); };
    const down = () => { el.dataset.press = "1"; };
    const up = () => { el.dataset.press = "0"; };
    const leave = () => { shown = false; el.style.opacity = "0"; };

    const frame = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="cursor" data-state="idle" data-press="0">
      <div className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
    </div>
  );
}
