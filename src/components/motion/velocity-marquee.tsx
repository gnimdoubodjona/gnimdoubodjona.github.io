"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Bandeau qui défile en continu, accélère avec la vitesse du scroll et change de sens avec lui.
// Chaque copie du contenu fait exactement la largeur du bandeau : la boucle reste sans trou.
export function VelocityMarquee({
  children,
  baseVelocity = 1.5,
  className,
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const paused = useRef(false);
  const speed = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // Ralentit et repart en douceur plutôt que de s'arrêter d'un coup
    const easing = Math.min(1, (delta / 1000) * 10);
    speed.current += ((paused.current ? 0 : 1) - speed.current) * easing;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy * speed.current);
  });

  return (
    <div
      // Le défilement s'arrête seulement quand la souris est sur un élément marqué data-marquee-pause
      onPointerOver={(e) => {
        if (e.pointerType !== "mouse") return;
        paused.current = !!(e.target as Element).closest(
          "[data-marquee-pause]"
        );
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <motion.div className="flex w-[200%]" style={{ x }}>
        <div className="flex flex-1 gap-2 pr-2">{children}</div>
        <div className="flex flex-1 gap-2 pr-2" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
