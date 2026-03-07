import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getPosts, getPostBySlug } from "@/lib/mdx";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} | Mitchell Bozentka`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      <article className="mx-auto max-w-[1200px] px-6 py-16">
        <Link
          href="/blog"
          className="text-sm text-primary hover:underline mb-8 inline-block"
        >
          ← Writing
        </Link>
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4">
            {post.title}
          </h1>
          <time
            dateTime={post.date}
            className="text-slate-500 dark:text-slate-400 text-sm"
          >
            {post.date}
          </time>
        </header>
        <div className="prose prose-slate lg:prose-lg mx-auto dark:prose-invert">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
