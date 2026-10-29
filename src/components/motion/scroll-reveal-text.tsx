"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo, useRef } from "react";

type Token = { word: string; href?: string; suffix?: string };

// Découpe un texte markdown simple en mots, en gardant les liens [texte](url)
function tokenize(markdown: string): Token[] {
  const tokens: Token[] = [];
  const pushPlain = (chunk: string) => {
    const words = chunk.split(/\s+/).filter(Boolean);
    // Ponctuation collée à un lien (ex. "[IPNet](...),") : on la rattache au mot précédent
    if (words.length && !/^\s/.test(chunk) && tokens.length) {
      const prev = tokens[tokens.length - 1];
      prev.suffix = (prev.suffix ?? "") + words.shift();
    }
    words.forEach((word) => tokens.push({ word }));
  };

  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(markdown))) {
    pushPlain(markdown.slice(last, match.index));
    const href = match[2];
    match[1].split(/\s+/).forEach((word) => tokens.push({ word, href }));
    last = linkPattern.lastIndex;
  }
  pushPlain(markdown.slice(last));
  return tokens;
}

function Word({
  token,
  progress,
  range,
  reduce,
}: {
  token: Token;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const external = token.href?.startsWith("http");
  return (
    <motion.span style={reduce ? undefined : { opacity }}>
      {token.href ? (
        <a
          href={token.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {token.word}
        </a>
      ) : (
        token.word
      )}
      {token.suffix}{" "}
    </motion.span>
  );
}

// Les mots s'illuminent progressivement au rythme du scroll
export function ScrollRevealText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion() ?? false;
  const tokens = useMemo(() => tokenize(text), [text]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  return (
    <p ref={ref} className={cn("text-pretty", className)}>
      {tokens.map((token, i) => (
        <Word
          key={i}
          token={token}
          progress={scrollYProgress}
          range={[i / tokens.length, (i + 1) / tokens.length]}
          reduce={reduce}
        />
      ))}
    </p>
  );
}
