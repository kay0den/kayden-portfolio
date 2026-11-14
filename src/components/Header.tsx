"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/site.config";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href="/" className="font-display text-lg font-bold tracking-wide">
        {site.name}
      </Link>
      <nav className="flex gap-6 text-sm">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="group relative py-1 text-muted transition-colors hover:text-ice">
            {l.label}
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cobalt transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
