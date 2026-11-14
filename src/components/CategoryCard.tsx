"use client";
import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "@/components/Tilt";
import type { Media } from "@/lib/types";

interface Props {
  slug: string;
  title: string;
  tagline: string;
  tint: string;
  count: number;
  previews: Media[];
}

/** Shown the instant a card is clicked, until the next page is ready. */
function Pending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-30 grid place-items-center bg-ink/55 transition-opacity duration-200 ${pending ? "opacity-100" : "opacity-0"}`}
    >
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-ice/25 border-t-cobalt" />
    </span>
  );
}

function Slide({ m }: { m: Media }) {
  if (m.type === "video")
    return <video src={m.src} poster={m.poster} muted loop autoPlay playsInline preload="metadata" className="h-full w-full object-cover" />;
  if (m.type === "embed")
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={m.thumb} alt={m.alt} className="h-full w-full object-cover" />;
  return <Image src={m.src} alt={m.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />;
}

export default function CategoryCard({ slug, title, tagline, tint, count, previews }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (previews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % previews.length), 3800);
    return () => clearInterval(t);
  }, [previews.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tilt max={7} scale={1.025} spotlight press className="rounded-[28px]">
        <Link
          href={`/work/${slug}`}
          data-cursor="Open"
          className="group/card relative block aspect-square overflow-hidden rounded-[28px] border border-line bg-deep"
        >
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.07]">
            {previews.length > 0 ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                >
                  <Slide m={previews[i]} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(60% 60% at 25% 20%, ${tint}55, transparent 70%), radial-gradient(50% 50% at 85% 90%, ${tint}33, transparent 70%), repeating-radial-gradient(circle at 70% 30%, transparent 0 34px, ${tint}14 35px 36px)`,
                }}
              />
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
          <Pending />

          <span className="absolute right-5 top-5 rounded-full border border-ice/20 bg-ink/40 px-3 py-1 text-xs text-ice/80">
            {count} {count === 1 ? "work" : "works"}
          </span>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
            <div className="transition-transform duration-500 group-hover/card:-translate-y-1">
              <h3 className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">{title}</h3>
              <p className="mt-3 text-sm text-ice/70 sm:text-base">{tagline}</p>
            </div>
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ice/30 transition-all duration-500 group-hover/card:rotate-45 group-hover/card:border-transparent group-hover/card:text-ink">
              <span className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 group-hover/card:scale-100" style={{ background: tint }} />
              <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </span>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}
