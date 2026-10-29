"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
  // "load" : au chargement de la page, "view" : quand le texte arrive à l'écran
  trigger?: "load" | "view";
}

// Les mots glissent un par un depuis le bas, comme s'ils sortaient d'une fente
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
  trigger = "load",
}: SplitTextProps) {
  const words = text.split(" ");
  const animation =
    trigger === "load"
      ? { animate: { y: "0%", opacity: 1 } }
      : {
          whileInView: { y: "0%", opacity: 1 },
          viewport: { once: true, margin: "-80px" },
        };

  return (
    <Tag className={cn("text-balance", className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "105%", opacity: 0 }}
              {...animation}
              transition={{
                delay: delay + i * 0.08,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
