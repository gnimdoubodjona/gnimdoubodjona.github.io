import BlurFade from "@/components/magicui/blur-fade";
import { SplitText } from "@/components/motion/split-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center pb-24 text-center">
      <BlurFade>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Erreur 404
        </span>
      </BlurFade>
      <SplitText
        text="Cette page s'est perdue en chemin."
        delay={0.1}
        className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl"
      />
      <BlurFade delay={0.4}>
        <p className="mx-auto mt-4 max-w-[420px] text-pretty text-muted-foreground">
          Le lien est peut-être incorrect, ou la page a été déplacée.
        </p>
      </BlurFade>
      <BlurFade delay={0.5}>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href="/" className={buttonVariants()}>
            <ArrowLeftIcon className="mr-2 size-4" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "glass glass-interactive"
            )}
          >
            Voir le blog
          </Link>
        </div>
      </BlurFade>
    </main>
  );
}
