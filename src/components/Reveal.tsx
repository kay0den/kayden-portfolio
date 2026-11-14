"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Scroll-triggered entrance for headings and blocks. */
export default function Reveal({
  as = "div",
  className,
  children,
  delay = 0,
}: {
  as?: "div" | "h1" | "h2" | "p";
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
