import Link from "next/link";
import { getPosts, formatDate } from "@/lib/mdx";
import { SiteHeader } from "@/components/site-header";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Writing | Mitchell Bozentka",
  description: "Blog and newsletter archive.",
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
          Writing
        </h1>
        <div className="mb-12 max-w-md">
          <NewsletterSignup formId={siteConfig.newsletter.beehiivFormId} />
        </div>
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>
                <time
                  dateTime={post.date}
                  className="text-sm text-slate-500 dark:text-slate-400 block mb-2"
                >
                  {formatDate(post.date)}
                </time>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        {posts.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            No posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
