"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Magnet from "@/components/react-bits/Magnet";
import { site } from "@/site.config";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Magnet magnetStrength={5} padding={40}>
        <Link href="/" className="font-display text-lg font-bold tracking-wide transition-[letter-spacing] duration-500 hover:tracking-[0.18em]">
          {site.name}
        </Link>
      </Magnet>
      <nav className="flex gap-4 text-sm">
        {links.map((l) => (
          <Magnet key={l.href} magnetStrength={4} padding={30}>
            <Link href={l.href} className="group relative block px-2 py-1 text-muted transition-colors hover:text-ice">
              {l.label}
              <span className="absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-cobalt transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          </Magnet>
        ))}
      </nav>
    </motion.header>
  );
}
