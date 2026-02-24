import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blogPosts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — InterviewPreview`,
    description: post.excerpt,
  };
}

const categoryColors: Record<string, string> = {
  "Interview Tips": "bg-accent/10 text-accent border-accent/20",
  "Career Advice": "bg-ink/5 text-ink-secondary border-ink/10",
  "Interview Prep": "bg-accent/15 text-accent border-accent/30",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category);

  return (
    <div className="min-h-screen bg-parchment">
      <Header />

      <main className="section-container py-16 lg:py-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink transition-colors mb-8"
        >
          &larr; Back to Blog
        </Link>

        {/* Article header */}
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full border ${
                  categoryColors[post.category] ||
                  "bg-ink/5 text-ink-secondary border-ink/10"
                }`}
              >
                {post.category}
              </span>
              <span className="text-xs text-ink-secondary">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-ink-secondary">
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-ink-secondary text-lg leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-xs font-bold">IP</span>
              </div>
              <span className="text-sm text-ink-secondary">{post.author}</span>
            </div>
          </div>

          {/* Article body */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="max-w-3xl mx-auto mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink mb-8">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <div className="paper-card p-5 hover:shadow-warm-lg transition-all h-full">
                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                        categoryColors[relatedPost.category] ||
                        "bg-ink/5 text-ink-secondary border-ink/10"
                      }`}
                    >
                      {relatedPost.category}
                    </span>
                    <h3 className="text-base font-display font-bold text-ink mt-3 mb-2 group-hover:text-accent transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-ink-secondary/80 text-sm leading-relaxed line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <span className="text-accent font-medium text-xs mt-3 inline-block group-hover:underline">
                      Read More &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
