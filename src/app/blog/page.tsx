import { BlogAuthor } from "@/components/blog-author";
import { BlogCover } from "@/components/blog-cover";
import BlurFade from "@/components/magicui/blur-fade";
import { SplitText } from "@/components/motion/split-text";
import { getBlogPosts } from "@/data/blog";
import { cn, formatDate } from "@/lib/utils";
import { NotebookPenIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Articles et retours d'expérience sur le développement frontend.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="pb-28 pt-4 sm:pt-10">
      <header className="text-center">
        <SplitText
          text="Blog"
          className="font-display text-7xl font-bold leading-none sm:text-9xl"
        />
      </header>

      <BlurFade delay={0.25}>
        <h2 className="mt-14 font-display text-3xl font-bold leading-tight sm:text-4xl">
          Articles et retours d&apos;expérience
        </h2>
      </BlurFade>

      {posts.length === 0 ? (
        <BlurFade delay={0.3}>
          <div className="glass mt-8 flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
            <NotebookPenIcon className="size-6 text-muted-foreground" />
            <p className="font-display text-xl font-semibold">
              Les premiers articles arrivent bientôt
            </p>
          </div>
        </BlurFade>
      ) : (
        <ol className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((post, i) => (
            <li
              key={post.slug}
              // Un article seul occupe toute la largeur
              className={cn(posts.length === 1 && "md:col-span-2")}
            >
              <BlurFade delay={0.3 + i * 0.08} inView className="h-full">
                <article className="glass glass-interactive group relative flex h-full flex-col gap-5 rounded-2xl p-5 sm:p-8">
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                      {/* Le lien couvre toute la carte */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="after:absolute after:inset-0 after:rounded-2xl"
                      >
                        {post.metadata.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <time dateTime={post.metadata.publishedAt}>
                        {formatDate(post.metadata.publishedAt)}
                      </time>{" "}
                      · {post.readingTime} min de lecture
                    </p>
                  </div>

                  <BlogAuthor />

                  <BlogCover
                    title={post.metadata.title}
                    tags={post.metadata.tags}
                    image={post.metadata.image}
                  />

                  <div className="space-y-3">
                    <p className="font-semibold">{post.metadata.summary}</p>
                    {post.excerpt && (
                      <p className="line-clamp-4 text-pretty leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
                    {post.metadata.tags?.length ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">Tags :</span>
                        {post.metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border px-2.5 py-0.5 text-sm transition-colors group-hover:border-foreground/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span />
                    )}
                    <span className="font-semibold underline-offset-4 group-hover:underline">
                      Lire la suite
                    </span>
                  </div>
                </article>
              </BlurFade>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
