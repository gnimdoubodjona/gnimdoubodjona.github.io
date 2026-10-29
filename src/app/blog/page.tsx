import BlurFade from "@/components/magicui/blur-fade";
import { SplitText } from "@/components/motion/split-text";
import { TiltCard } from "@/components/motion/tilt-card";
import { getBlogPosts } from "@/data/blog";
import { formatDate, readingTime } from "@/lib/utils";
import { ArrowUpRightIcon, NotebookPenIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Mes réflexions sur le développement, le design et le freelance.",
};

export default async function BlogPage() {
  const posts = (await getBlogPosts()).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <main className="space-y-10 pb-24 pt-4 sm:pt-10">
      <header className="space-y-4">
        <BlurFade>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Blog · {posts.length} article{posts.length > 1 ? "s" : ""}
          </span>
        </BlurFade>
        <SplitText
          text="Notes, retours d'expérience et découvertes."
          className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl"
        />
        <BlurFade delay={0.3}>
          <p className="max-w-[520px] text-pretty text-muted-foreground md:text-lg/relaxed">
            Ce que j&apos;apprends en construisant des interfaces, des API et
            des applications mobiles, et en travaillant en freelance.
          </p>
        </BlurFade>
      </header>

      {posts.length === 0 ? (
        <BlurFade delay={0.4}>
          <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
            <NotebookPenIcon className="size-6 text-muted-foreground" />
            <p className="font-display text-xl font-semibold">
              Les premiers articles arrivent bientôt
            </p>
            <p className="max-w-[360px] text-sm text-muted-foreground">
              Je prépare des articles sur mes projets et mes outils. Revenez
              dans quelques jours.
            </p>
          </div>
        </BlurFade>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <TiltCard key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="glass glass-interactive group block rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                  <span>{readingTime(post.source)} min de lecture</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold sm:text-2xl">
                  {post.metadata.title}
                </h2>
                <p className="mt-2 text-pretty text-sm text-muted-foreground">
                  {post.metadata.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  Lire l&apos;article
                  <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </TiltCard>
          ))}
        </div>
      )}
    </main>
  );
}
