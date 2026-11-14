"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "@/components/Tilt";
import type { Media } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;
const STEP = 6; // how many tiles are brought in at a time

/* ── column count (1 / 2 / 3) without layout jumps when more tiles are appended ── */
const subscribeCols = (cb: () => void) => {
  const qs = [window.matchMedia("(min-width: 1024px)"), window.matchMedia("(min-width: 640px)")];
  qs.forEach((q) => q.addEventListener("change", cb));
  return () => qs.forEach((q) => q.removeEventListener("change", cb));
};
const colsNow = () =>
  window.matchMedia("(min-width: 1024px)").matches ? 3 : window.matchMedia("(min-width: 640px)").matches ? 2 : 1;
const useColumns = () => useSyncExternalStore(subscribeCols, colsNow, () => 3);

const ratio = (m: Media) => (m.type === "image" ? `${m.width} / ${m.height}` : "16 / 9");

function PlayBadge() {
  return (
    <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-ice">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    </span>
  );
}

/** One gallery tile: a skeleton first, the real picture fades in once it has loaded. */
function Tile({ m, ready, onOpen }: { m: Media; ready: boolean; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [hover, setHover] = useState(false);
  const fade = `object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.04] ${loaded ? "opacity-100" : "opacity-0"}`;

  return (
    <button
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-label={`Open ${m.alt}`}
      className="fade-up group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-deep text-left"
      style={{ aspectRatio: ratio(m) }}
    >
      {!loaded && <span aria-hidden className="shimmer absolute inset-0" />}
      {ready && m.type === "image" && (
        <Image
          src={m.src}
          alt={m.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={60}
          onLoad={() => setLoaded(true)}
          className={fade}
        />
      )}
      {ready && m.type === "embed" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.thumb} alt={m.alt} loading="lazy" onLoad={() => setLoaded(true)} className={`absolute inset-0 h-full w-full ${fade}`} />
      )}
      {ready && m.type === "video" && (
        <>
          {m.poster && (
            <Image src={m.poster} alt={m.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" quality={60} onLoad={() => setLoaded(true)} className={fade} />
          )}
          {/* the video itself is only fetched when the mouse is over the tile */}
          {hover && <video src={m.src} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />}
        </>
      )}
      {m.type !== "image" && <PlayBadge />}
    </button>
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
  const cols = useColumns();
  const [count, setCount] = useState(STEP);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const sentinel = useRef<HTMLDivElement>(null);
  // true only on the client (the lightbox portal needs document)
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // 1) the page and its skeleton tiles paint first, 2) only then do the pictures start loading
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  // 3) the rest comes in a few tiles at a time, only as the visitor scrolls toward it
  useEffect(() => {
    if (!ready || count >= media.length) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCount((c) => Math.min(c + STEP, media.length)); },
      { rootMargin: "500px" },
    );
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, [ready, count, media.length]);

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

  const buckets: { m: Media; i: number }[][] = Array.from({ length: cols }, () => []);
  media.slice(0, count).forEach((m, i) => buckets[i % cols].push({ m, i }));

  return (
    <>
      <div className="flex gap-5">
        {buckets.map((col, ci) => (
          <div key={ci} className="flex min-w-0 flex-1 flex-col gap-5">
            {col.map(({ m, i }) => (
              <Tile key={i} m={m} ready={ready} onOpen={() => { setDir(1); setOpen(i); }} />
            ))}
          </div>
        ))}
      </div>
      {count < media.length && <div ref={sentinel} aria-hidden className="h-10" />}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <motion.div
                key="lb"
                className="fixed inset-0 z-[80] grid place-items-center bg-ink/95"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={close}
                role="dialog"
                aria-modal="true"
              >
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={open}
                    initial={{ opacity: 0, scale: 0.94, x: dir * 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.97, x: dir * -40 }}
                    transition={{ duration: 0.35, ease }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Full m={media[open]} />
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={(e) => { e.stopPropagation(); close(); }}
                  aria-label="Close"
                  className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-ice/25 text-ice transition-colors hover:bg-ice/10"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>

                {media.length > 1 && (
                  <>
                    {[-1, 1].map((d) => (
                      <button
                        key={d}
                        onClick={(e) => { e.stopPropagation(); go(d); }}
                        aria-label={d === 1 ? "Next" : "Previous"}
                        className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ice/25 text-ice transition-colors hover:bg-ice/10 ${d === 1 ? "right-4 sm:right-8" : "left-4 sm:left-8"}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={d === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
                        </svg>
                      </button>
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
