"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-cobalt" style={{ scaleX }} />;
}
