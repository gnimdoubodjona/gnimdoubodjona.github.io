"use client";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

const HEADING = "Parlons de votre projet.";
// L'espace insécable garde « ? » collé au mot précédent
const TEXT =
  "Une idée, une mission freelance ou simplement une question ? Écrivez-moi, je réponds rapidement.";

// Découpe en lettres, en gardant chaque mot insécable pour que les retours à la ligne restent naturels
function Letters({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span key={i} aria-hidden>
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((char, j) => (
          <span key={j} data-scatter className="inline-block will-change-transform">
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
      {i < words.length - 1 && " "}
    </span>
  ));
}

// Les lettres sont éparpillées dans toute la section ; quand on y arrive,
// elles tournoient et rebondissent jusqu'à leur place pour reformer les phrases.
export function ContactAssemble() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-scatter]");

        // Position de départ aléatoire sur toute la largeur de l'écran et la hauteur de la section,
        // exprimée par rapport à la place finale de chaque lettre
        const offsetLeft = (el: HTMLElement) =>
          el.getBoundingClientRect().left -
          section.getBoundingClientRect().left;
        const offsetTop = (el: HTMLElement) =>
          el.getBoundingClientRect().top - section.getBoundingClientRect().top;

        const scatter = () => {
          const width = section.offsetWidth;
          const height = section.offsetHeight;
          const gutter = (window.innerWidth - width) / 2;
          gsap.set(items, { clearProps: "transform" });
          // On mesure toutes les places finales avant de déplacer quoi que ce soit
          const homes = items.map((el) => ({
            x: offsetLeft(el) + el.offsetWidth / 2,
            y: offsetTop(el) + el.offsetHeight / 2,
          }));
          items.forEach((el, i) => {
            gsap.set(el, {
              x: gsap.utils.random(-gutter + 16, width + gutter - 16) - homes[i].x,
              y: gsap.utils.random(height * 0.04, height * 0.96) - homes[i].y,
              rotation: gsap.utils.random(-180, 180),
              rotationX: gsap.utils.random(-90, 90),
              rotationY: gsap.utils.random(-90, 90),
              scale: gsap.utils.random(0.4, 1.8),
              opacity: gsap.utils.random(0.25, 0.7),
            });
          });
        };
        scatter();

        // Légère dérive des lettres tant qu'elles sont éparpillées, pour que la section respire
        const drift = gsap.to(items, {
          y: () => `+=${gsap.utils.random(-14, 14)}`,
          x: () => `+=${gsap.utils.random(-10, 10)}`,
          rotation: () => `+=${gsap.utils.random(-12, 12)}`,
          duration: () => gsap.utils.random(2.5, 4),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        let assemble: gsap.core.Tween | null = null;
        let assembled = false;
        ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          // Redimensionnement ou polices chargées : on remesure les places tant que c'est éparpillé
          onRefresh: () => {
            if (assembled) return;
            scatter();
            drift.invalidate().restart();
          },
          onEnter: () => {
            assembled = true;
            drift.pause();
            assemble?.kill();
            assemble = gsap.to(items, {
              x: 0,
              y: 0,
              rotation: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              opacity: 1,
              duration: 2.8,
              ease: "elastic.out(1, 0.75)",
              stagger: { each: 0.018, from: "random" },
            });
          },
          onLeaveBack: () => {
            // En remontant, les lettres repartent dans tous les sens
            assembled = false;
            assemble?.kill();
            assemble = null;
            scatter();
            drift.invalidate().restart();
          },
        });
      });
    }, section);

    // Les polices changent la taille des lettres : on recalcule une fois chargées
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-[90dvh] flex-col items-center justify-center py-24 text-center [perspective:800px]"
    >
     
      <h2
        aria-label={HEADING}
        className="mt-4 text-balance font-display text-4xl font-bold leading-tight sm:text-6xl"
      >
        <Letters text={HEADING} />
      </h2>
      <p
        aria-label={TEXT}
        className="mx-auto mt-5 max-w-[480px] text-pretty text-muted-foreground md:text-lg/relaxed"
      >
        <Letters text={TEXT} />
      </p>
      <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Link
          data-scatter
          href={DATA.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
        >
          <Icons.whatsapp className="size-4" />
          WhatsApp
        </Link>
        <Link
          data-scatter
          href={`mailto:${DATA.contact.email}`}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "glass glass-interactive min-w-0 gap-2 px-4"
          )}
        >
          <Icons.email className="size-4 shrink-0" />
          <span className="truncate">{DATA.contact.email}</span>
        </Link>
      </div>
    </section>
  );
}
