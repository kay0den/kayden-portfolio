"use client";
import Image from "next/image";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "@/components/Tilt";
import type { Media } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

function PlayBadge() {
  return (
    <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-ice transition-transform duration-500 group-hover:scale-110">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    </span>
  );
}

function Thumb({ m }: { m: Media }) {
  if (m.type === "image")
    return (
      <Image
        src={m.src}
        alt={m.alt}
        width={m.width}
        height={m.height}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  if (m.type === "video")
    return (
      <div className="relative aspect-video bg-deep">
        <video
          src={m.src}
          poster={m.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onPointerEnter={(e) => void e.currentTarget.play().catch(() => {})}
          onPointerLeave={(e) => e.currentTarget.pause()}
        />
        <PlayBadge />
      </div>
    );
  return (
    <div className="relative aspect-video bg-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.thumb} alt={m.alt} loading="lazy" className="h-full w-full object-cover" />
      <PlayBadge />
    </div>
  );
}

function Full({ m }: { m: Media }) {
  if (m.type === "image")
    return (
      <Tilt max={4} scale={1} className="rounded-2xl">
        <Image
          src={m.src}
          alt={m.alt}
          width={m.width}
          height={m.height}
          sizes="92vw"
          priority
          className="h-auto max-h-[82vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-[0_40px_120px_-30px_rgba(78,107,255,.45)]"
        />
      </Tilt>
    );
  if (m.type === "video")
    return (
      <video
        src={m.src}
        poster={m.poster}
        controls
        autoPlay
        playsInline
        className="max-h-[82vh] max-w-[92vw] rounded-2xl shadow-[0_40px_120px_-30px_rgba(78,107,255,.45)]"
      />
    );
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${m.id}?autoplay=1&rel=0`}
      title={m.alt}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      className="aspect-video w-[92vw] max-w-5xl rounded-2xl"
    />
  );
}

export default function CategoryGallery({ media }: { media: Media[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  // true only on the client (portal needs document)
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (d: number) => {
      setDir(d);
      setOpen((i) => (i === null ? i : (i + d + media.length) % media.length));
    },
    [media.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {media.map((m, i) => (
          <motion.div
            key={i}
            className="break-inside-avoid"
            initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.09, ease }}
          >
            <Tilt max={5} scale={1.02} press className="rounded-2xl">
              <button
                onClick={() => { setDir(1); setOpen(i); }}
                aria-label={`Open ${m.alt}`}
                data-cursor="View"
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-deep text-left"
              >
                <Thumb m={m} />
              </button>
            </Tilt>
          </motion.div>
        ))}
      </div>

      {mounted && createPortal(
      <AnimatePresence>
        {open !== null && (
          <motion.div
            key="lb"
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/92 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={open}
                custom={dir}
                initial={{ opacity: 0, scale: 0.9, x: dir * 70 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: dir * -50 }}
                transition={{ duration: 0.45, ease }}
                onClick={(e) => e.stopPropagation()}
              >
                <Full m={media[open]} />
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={(e) => { e.stopPropagation(); close(); }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-ice/25 text-ice"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </motion.button>

            {media.length > 1 && (
              <>
                {[-1, 1].map((d) => (
                  <motion.button
                    key={d}
                    onClick={(e) => { e.stopPropagation(); go(d); }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={d === 1 ? "Next" : "Previous"}
                    className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ice/25 text-ice ${d === 1 ? "right-4 sm:right-8" : "left-4 sm:left-8"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
                    </svg>
                  </motion.button>
                ))}
                <span className="absolute bottom-6 text-sm text-muted">{open + 1} / {media.length}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </>
  );
}
