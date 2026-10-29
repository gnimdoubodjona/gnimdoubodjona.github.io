"use client";

import { SplitText } from "@/components/motion/split-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownIcon, FileDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // En scrollant, le contenu remonte doucement et s'efface
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const avatarRotate = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const avatarScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  // La photo suit discrètement la souris
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const avatarX = useSpring(pointerX, { stiffness: 60, damping: 15 });
  const avatarY = useSpring(pointerY, { stiffness: 60, damping: 15 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth - 0.5) * 16);
      pointerY.set((e.clientY / window.innerHeight - 0.5) * 16);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointerX, pointerY]);

  return (
    <section id="hero" ref={ref} className="pt-4 sm:pt-10">
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="order-2 flex min-w-0 flex-1 flex-col gap-5 sm:order-1">
          <SplitText
            text={`Salut, je suis ${DATA.name.split(" ")[0]}.`}
            delay={0.1}
            className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
          >
            {DATA.role} · {DATA.location}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease }}
          className="order-1 sm:order-2"
        >
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    x: avatarX,
                    y: avatarY,
                    rotate: avatarRotate,
                    scale: avatarScale,
                  }
            }
          >
            <Avatar className="size-20 border-4 border-white/70 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)] dark:border-white/10 sm:size-32">
              <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
              <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="mt-6 space-y-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.55, duration: 0.8, ease }}
          className="max-w-[560px] text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {DATA.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease }}
          className="flex flex-wrap gap-2"
        >
          <Link href="#projects" className={buttonVariants()}>
            Voir mes projets
            <ArrowDownIcon className="ml-2 size-4" />
          </Link>
          <a
            href={DATA.cvUrl}
            download
            className={cn(
              buttonVariants({ variant: "outline" }),
              "glass glass-interactive"
            )}
          >
            <FileDownIcon className="mr-2 size-4" />
            Télécharger mon CV
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
