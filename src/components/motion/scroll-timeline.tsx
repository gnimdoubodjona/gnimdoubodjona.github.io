"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

// Une ligne verticale se dessine le long de la liste au fil du scroll
export function ScrollTimeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <div ref={ref} className="relative pl-5">
      <div className="absolute left-1 top-2 bottom-2 w-px bg-border" />
      <motion.div
        style={{ scaleY }}
        className="absolute left-1 top-2 bottom-2 w-px origin-top bg-foreground"
      />
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
