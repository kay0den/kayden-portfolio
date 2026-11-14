"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import VariableProximity from "@/components/react-bits/VariableProximity";
import Magnet from "@/components/react-bits/Magnet";
import { site } from "@/site.config";

// uses Math.random internally, so it renders in the browser only
const RotatingText = dynamic(() => import("@/components/react-bits/RotatingText"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6">
      <motion.div style={{ y: lift, opacity: fade }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
        >
          <div className="relative flex flex-wrap items-end gap-x-6 gap-y-5">
            {/* soft bloom behind the name */}
            <div aria-hidden className="pointer-events-none absolute -left-10 top-1/2 h-48 w-[70%] -translate-y-1/2 rounded-full bg-cobalt/20 blur-[90px]" />
            <h1 className="relative">
              {/* pure-CSS shine: sweeps by itself, never reacts to the mouse */}
              <span className="shine-text font-display text-[clamp(3.5rem,13vw,10.5rem)] font-extrabold leading-[0.9] tracking-tight">
                {site.name}
              </span>
            </h1>
            <motion.div
              className="relative mb-[0.6vw]"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.3, ease }}
            >
              <RotatingText
                texts={["Coding", "Drawing", "Modeling", "Building", "Rigging"]}
                effect="flip"
                highlight
                highlightColor="#4e6bff"
                rotationInterval={2300}
                staggerDuration={0.035}
                mainClassName="font-display text-[clamp(1.5rem,4.4vw,3.4rem)] font-bold text-white px-4 py-1.5 sm:px-5 rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-xl sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
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
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Magnet magnetStrength={4} padding={50}>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full border border-ice/25 px-6 py-3 text-sm text-ice transition-colors hover:border-cobalt hover:bg-cobalt"
            >
              See my work
              <svg className="transition-transform duration-500 group-hover:translate-y-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </a>
          </Magnet>
        </motion.div>
      </motion.div>
    </section>
  );
}
