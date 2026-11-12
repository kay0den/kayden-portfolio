"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Media } from "@/lib/types";

interface Props {
  slug: string;
  title: string;
  tagline: string;
  tint: string;
  count: number;
  previews: Media[];
}

function Slide({ m }: { m: Media }) {
  return m.type === "video" ? (
    <video src={m.src} poster={m.poster} muted loop autoPlay playsInline preload="metadata" className="h-full w-full object-cover" />
  ) : (
    <Image src={m.src} alt={m.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
  );
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
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/work/${slug}`}
        className="group relative block aspect-square overflow-hidden rounded-[28px] border border-line bg-deep"
      >
        {/* media layer */}
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]">
          {previews.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1 }}
              >
                <Slide m={previews[i]} />
              </motion.div>
            </AnimatePresence>
          ) : (
            // Empty-state art: used until real work is added to this category
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(60% 60% at 25% 20%, ${tint}55, transparent 70%), radial-gradient(50% 50% at 85% 90%, ${tint}33, transparent 70%), repeating-radial-gradient(circle at 70% 30%, transparent 0 34px, ${tint}14 35px 36px)`,
              }}
            />
          )}
        </div>

        {/* legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

        <span className="absolute right-5 top-5 rounded-full border border-ice/20 bg-ink/40 px-3 py-1 text-xs text-ice/80">
          {count} {count === 1 ? "work" : "works"}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
          <div>
            <h3 className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">{title}</h3>
            <p className="mt-3 text-sm text-ice/70 sm:text-base">{tagline}</p>
          </div>
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ice/30 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:text-ink"
            style={{ ["--t" as string]: tint }}
          >
            <span className="absolute h-12 w-12 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100" style={{ background: tint }} />
            <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
