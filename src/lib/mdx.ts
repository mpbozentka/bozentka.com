import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  title: string;
  date: string;
  description: string;
}

export interface Post extends PostMeta {
  slug: string;
}

export interface PostWithContent extends PostMeta {
  slug: string;
  content: string;
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

export function getPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: Post[] = filenames.map((filename) => {
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const slug = getSlugFromFilename(filename);
    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      description: data.description ?? "",
    };
  });
  return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostWithContent | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    description: data.description ?? "",
    content,
  };
}
