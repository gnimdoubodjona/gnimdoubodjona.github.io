"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

// Carte qui se redresse en entrant à l'écran puis s'incline légèrement vers le curseur
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.65"],
  });
  const enterRotate = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const enterY = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const enterOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 180, damping: 18 };
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), spring);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), spring);
  const rotateX = useTransform(
    [tiltX, enterRotate],
    ([tilt, enter]: number[]) => tilt + enter
  );

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div ref={ref} className="h-full [perspective:1000px]">
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={
          reduce
            ? undefined
            : { rotateX, rotateY: tiltY, y: enterY, opacity: enterOpacity }
        }
        className={cn("h-full will-change-transform", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
