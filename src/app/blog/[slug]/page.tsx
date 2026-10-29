import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import BlurFade from "@/components/magicui/blur-fade";
import { SplitText } from "@/components/motion/split-text";
import { formatDate, readingTime } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let post = await getPost(params.slug);
  if (!post) return undefined;

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section id="blog" className="pb-24 pt-4 sm:pt-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${DATA.url}${post.metadata.image}`
              : `${DATA.url}/og?title=${post.metadata.title}`,
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      <BlurFade>
        <Link
          href="/blog"
          className="glass glass-interactive inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
        >
          <ArrowLeftIcon className="size-3.5" />
          Retour au blog
        </Link>
      </BlurFade>
      <header className="mt-8 space-y-4">
        <SplitText
          text={post.metadata.title}
          className="font-display text-3xl font-bold leading-[1.1] sm:text-5xl"
        />
        <BlurFade delay={0.3}>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span>{DATA.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime(post.source)} min de lecture</span>
          </p>
        </BlurFade>
      </header>
      <BlurFade delay={0.4}>
        <article
          className="prose mt-10 max-w-none text-pretty dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:underline-offset-4 prose-pre:rounded-2xl prose-pre:border prose-pre:bg-muted/40"
          dangerouslySetInnerHTML={{ __html: post.source }}
        ></article>
      </BlurFade>
    </section>
  );
}
