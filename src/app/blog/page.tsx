import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/lib/blogPosts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Blog — InterviewPreview",
  description:
    "Interview tips, career advice, and preparation strategies to help you land your next role. Practical guides from people who've been on both sides of the table.",
};

const categoryColors: Record<string, string> = {
  "Interview Tips": "bg-accent/10 text-accent border-accent/20",
  "Career Advice": "bg-ink/5 text-ink-secondary border-ink/10",
  "Interview Prep": "bg-accent/15 text-accent border-accent/30",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="min-h-screen bg-parchment">
      <Header />

      <main className="section-container py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="label-tag mb-3">InterviewPreview Blog</p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink mb-4">
            Tips, Guides & Insights
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to walk into your next interview feeling
            prepared, confident, and ready.
          </p>
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${featured.slug}`} className="block group mb-16">
          <div className="paper-card overflow-hidden hover:shadow-warm-lg transition-all">
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 h-48 sm:h-64 flex items-center justify-center border-b border-border">
              <span className="text-7xl opacity-20 group-hover:scale-110 transition-transform">
                📖
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full border ${
                    categoryColors[featured.category] ||
                    "bg-ink/5 text-ink-secondary border-ink/10"
                  }`}
                >
                  {featured.category}
                </span>
                <span className="text-xs text-ink-secondary">
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-ink-secondary">
                  {featured.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mb-3 group-hover:text-accent transition-colors">
                {featured.title}
              </h2>
              <p className="text-ink-secondary leading-relaxed mb-4">
                {featured.excerpt}
              </p>
              <span className="text-accent font-medium text-sm group-hover:underline transition-colors">
                Read More &rarr;
              </span>
            </div>
          </div>
        </Link>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="paper-card overflow-hidden hover:shadow-warm-lg transition-all h-full flex flex-col">
                <div className="bg-gradient-to-br from-accent/5 to-ink/5 h-36 flex items-center justify-center border-b border-border">
                  <span className="text-5xl opacity-15 group-hover:scale-110 transition-transform">
                    📝
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                        categoryColors[post.category] ||
                        "bg-ink/5 text-ink-secondary border-ink/10"
                      }`}
                    >
                      {post.category}
                    </span>
                    <span className="text-[10px] text-ink-secondary">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-ink-secondary/80 text-sm leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-ink-secondary">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-accent font-medium text-xs group-hover:underline transition-colors">
                      Read More &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
