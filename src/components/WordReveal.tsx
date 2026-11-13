"use client";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Headline whose words rise out of a mask one after another when scrolled into view. */
export default function WordReveal({
  text,
  as = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.85, ease } } }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Thin line that draws itself from left to right. */
export function DrawLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left bg-gradient-to-r from-cobalt via-line to-transparent ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.4, ease }}
    />
  );
}
