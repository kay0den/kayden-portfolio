"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiscordIcon } from "@hugeicons/core-free-icons";
import Magnet from "@/components/react-bits/Magnet";
import VariableProximity from "@/components/react-bits/VariableProximity";
import { usePressRipple } from "@/components/usePressRipple";
import WordReveal from "@/components/WordReveal";
import { site, type ContactItem } from "@/site.config";

function ContactCard({ item }: { item: ContactItem }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const card = usePressRipple();
  const btn = usePressRipple("rgba(10,14,26,.25)");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the username is still visible to copy by hand */
    }
  };

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerDown={card.onPointerDown}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mx-auto w-full max-w-3xl overflow-hidden rounded-[32px] border border-line bg-deep/90 p-8 sm:p-12"
    >
      {card.layer}
      {/* cursor-following light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--px,50%) var(--py,50%), rgba(78,107,255,.22), transparent 65%)" }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cobalt/25 blur-3xl" />

      <div className="relative flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.1 }}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-cobalt text-white"
          >
            <HugeiconsIcon icon={DiscordIcon} size={28} />
          </motion.span>
          <span className="text-lg text-muted">{item.label}</span>
        </div>

        <p className="font-display text-[clamp(3rem,13vw,6.75rem)] leading-none tracking-tight">
          <VariableProximity
            label={item.value}
            containerRef={ref}
            fromFontVariationSettings="'wght' 500"
            toFontVariationSettings="'wght' 800"
            radius={150}
            falloff="gaussian"
            fromColor="#e9edf8"
            toColor="#8fa2ff"
          />
        </p>

        <div>
          <Magnet magnetStrength={4} padding={60}>
            <motion.button
              onClick={copy}
              data-cursor="Copy"
              onPointerDown={btn.onPointerDown}
              whileTap={{ scale: 0.92 }}
              className="relative min-w-44 overflow-hidden rounded-full bg-ice px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-white"
            >
              {btn.layer}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "c" : "n"}
                  className="block"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {copied ? "Copied ✓" : "Copy username"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </Magnet>
        </div>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const loop = Array.from({ length: 8 }, () => site.handle).join("  •  ");
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line/60 px-6 py-32 sm:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 select-none overflow-hidden">
        <div
          className="marquee flex w-max whitespace-nowrap font-display text-[clamp(5rem,16vw,13rem)] font-bold leading-none text-transparent opacity-[0.12]"
          style={{ WebkitTextStroke: "1.5px var(--ice)" }}
        >
          <span>{loop}  •  </span>
          <span>{loop}  •  </span>
        </div>
      </div>
      <div className="relative">
        <WordReveal text="Feel free to talk with me" className="mx-auto mb-14 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl" />
        {site.contact.map((c) => (
          <ContactCard key={c.id} item={c} />
        ))}
      </div>
    </section>
  );
}
