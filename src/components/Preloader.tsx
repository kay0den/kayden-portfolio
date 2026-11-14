"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/site.config";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("kayden-intro") === "1"; } catch { /* ignore */ }
    const t = setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem("kayden-intro", "1"); } catch { /* ignore */ }
    }, seen ? 60 : 1150);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden">
            <div className="flex font-display text-[clamp(3rem,12vw,8rem)] font-bold leading-none tracking-tight">
              {site.name.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
            </div>
          </div>
          <motion.span
            className="absolute bottom-[18%] h-px w-40 origin-left bg-cobalt"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
