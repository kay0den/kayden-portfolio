"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// WebGL background (real React Bits "Dark Veil"), loaded client-side only.
const DarkVeil = dynamic(() => import("@/components/react-bits/DarkVeil"), { ssr: false });

export default function Background() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ink">
      <DarkVeil color="#4e6bff" paused={reduced} className="h-full w-full" />
      {/* vignette keeps text readable over the effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--ink)_95%)]" />
    </div>
  );
}
