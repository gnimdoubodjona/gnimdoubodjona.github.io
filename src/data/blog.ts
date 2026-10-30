import { readingTime } from "@/lib/utils";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags?: string[];
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

// Premier paragraphe de texte de l'article, sans la syntaxe markdown, pour l'aperçu du blog
function getExcerpt(markdown: string) {
  const paragraph = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .find((block) => block && !/^(#|-|\*\s|\d+\.|```|\||>|!\[)/.test(block));
  return (paragraph ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ");
}

// Lecture rapide : uniquement le frontmatter et le texte brut, sans conversion en HTML
function readPost(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { content, data } = matter(fs.readFileSync(filePath, "utf-8"));
  return {
    slug,
    metadata: data as Metadata,
    content,
    excerpt: getExcerpt(content),
    readingTime: readingTime(content),
  };
}

export async function getPost(slug: string) {
  const post = readPost(slug);
  if (!post) return null;
  return {
    slug,
    metadata: post.metadata,
    readingTime: post.readingTime,
    // La coloration du code (Shiki) est coûteuse : on ne la fait que pour la page de l'article
    source: await markdownToHTML(post.content),
  };
}

export async function getBlogPosts() {
  return getMDXFiles(CONTENT_DIR)
    .map((file) => readPost(path.basename(file, path.extname(file)))!)
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    );
}
