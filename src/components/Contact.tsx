"use client";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiscordIcon } from "@hugeicons/core-free-icons";
import Magnet from "@/components/react-bits/Magnet";
import { site, type ContactItem } from "@/site.config";

function ContactCard({ item }: { item: ContactItem }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the username is still visible to copy by hand */
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[32px] border border-line bg-deep/90 p-8 sm:p-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cobalt/30 blur-3xl" />
      <div className="relative flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cobalt text-white">
            <HugeiconsIcon icon={DiscordIcon} size={28} />
          </span>
          <span className="text-lg text-muted">{item.label}</span>
        </div>
        <p className="break-all font-display text-[clamp(2.75rem,12vw,6.5rem)] font-bold leading-none tracking-tight">
          {item.value}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Magnet magnetStrength={4} padding={60}>
            <button
              onClick={copy}
              className="rounded-full bg-ice px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-white"
            >
              {copied ? "Copied ✓" : "Copy username"}
            </button>
          </Magnet>
          <span className="text-sm text-muted">Send me a friend request, I reply fast.</span>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const loop = Array.from({ length: 8 }, () => site.handle).join("  •  ");
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line/60 px-6 py-32 sm:py-44">
      {/* outlined marquee behind the content */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 select-none overflow-hidden">
        <div className="marquee flex w-max whitespace-nowrap font-display text-[clamp(5rem,16vw,13rem)] font-bold leading-none text-transparent opacity-[0.12]" style={{ WebkitTextStroke: "1.5px var(--ice)" }}>
          <span>{loop}  •  </span>
          <span>{loop}  •  </span>
        </div>
      </div>
      <div className="relative">
        <h2 className="mx-auto mb-14 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Have an idea? Let&apos;s talk.
        </h2>
        {site.contact.map((c) => (
          <ContactCard key={c.id} item={c} />
        ))}
      </div>
    </section>
  );
}
