"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ShinyText from "@/components/react-bits/ShinyText";
import VariableProximity from "@/components/react-bits/VariableProximity";
import Magnet from "@/components/react-bits/Magnet";
import { usePressRipple } from "@/components/usePressRipple";
import { site } from "@/site.config";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const btn = usePressRipple();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18, mass: 0.7 };
  const rotateX = useSpring(useTransform(py, [-1, 1], [8, -8]), spring);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-10, 10]), spring);
  const x = useSpring(useTransform(px, [-1, 1], [-16, 16]), spring);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 70, filter: "blur(18px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.3, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div style={{ rotateX, rotateY, x, transformPerspective: 1100 }}>
          <h1>
          <ShinyText
            text={site.name}
            color="#b3bfef"
            shineColor="#ffffff"
            speed={3.4}
            delay={0.6}
            angle={110}
            shineWidth={36}
            glow={0.35}
            followPointer
            className="font-display text-[clamp(4rem,17vw,13rem)] font-extrabold leading-[0.9] tracking-tight"
          />
          </h1>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8 text-xl sm:text-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <VariableProximity
          label={site.role}
          containerRef={ref}
          fromFontVariationSettings="'wght' 300"
          toFontVariationSettings="'wght' 800"
          radius={130}
          falloff="gaussian"
          fromColor="#8c96b3"
          toColor="#ffffff"
          className="font-sans"
        />
      </motion.div>

      <motion.div
        className="mt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.3 }}
      >
        <Magnet magnetStrength={4} padding={50}>
          <motion.a
            href="#work"
            onPointerDown={btn.onPointerDown}
            whileTap={{ scale: 0.94 }}
            className="group relative inline-flex overflow-hidden items-center gap-3 rounded-full border border-ice/25 px-6 py-3 text-sm text-ice transition-colors hover:border-cobalt hover:bg-cobalt"
          >
            {btn.layer}
            See my work
            <svg className="transition-transform duration-500 group-hover:translate-y-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </motion.a>
        </Magnet>
      </motion.div>
    </section>
  );
}
