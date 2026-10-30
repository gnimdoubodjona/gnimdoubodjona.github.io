import { DATA } from "@/data/resume";
import Image from "next/image";

// Visuel de l'article : l'image du frontmatter si elle existe,
// sinon une couverture générée façon miniature (titre + fenêtre de code)
export function BlogCover({
  title,
  tags,
  image,
}: {
  title: string;
  tags?: string[];
  image?: string;
}) {
  if (image) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <Image
          src={image}
          alt={title}
          width={800}
          height={450}
          className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border bg-foreground text-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,hsl(var(--background)/0.14),transparent_55%)]" />

      <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
        <span className="flex size-7 items-center justify-center rounded-full border border-background/30 font-display text-[10px] font-bold">
          {DATA.initials}
        </span>
        <span className="text-xs opacity-70">{DATA.name}</span>
      </div>

      <p className="absolute bottom-4 left-4 max-w-[60%] font-display text-xl font-bold leading-tight sm:bottom-6 sm:left-6 sm:text-3xl">
        {title}
      </p>

      <div className="absolute -right-4 top-10 w-[46%] rotate-[-6deg] rounded-lg border border-background/15 bg-background/10 p-3 font-mono text-[9px] leading-relaxed shadow-2xl backdrop-blur transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:rotate-[-3deg] sm:top-12 sm:text-[11px]">
        <div className="mb-2 flex gap-1">
          <span className="size-2 rounded-full bg-background/40" />
          <span className="size-2 rounded-full bg-background/40" />
          <span className="size-2 rounded-full bg-background/40" />
        </div>
        <p>
          <span className="opacity-50">const</span> article = {"{"}
        </p>
        <p className="pl-3">
          auteur: <span className="opacity-60">&quot;{DATA.name.split(" ")[0]}&quot;</span>,
        </p>
        <p className="pl-3">
          tags: <span className="opacity-60">[{(tags ?? []).slice(0, 2).map((t) => `"${t}"`).join(", ")}]</span>,
        </p>
        <p>{"}"};</p>
      </div>
    </div>
  );
}
