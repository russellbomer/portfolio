import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Writing",
  description: "Thoughts on my work, my life, and the occasional tangent.",
  pathname: "/writing",
});

// Placeholder for future blog posts
const posts: Array<{
  slug: string;
  title: string;
  date: string;
  description: string;
}> = [];

export default function WritingPage() {
  return (
    <article id="main-content" className="mx-auto max-w-2xl px-8 py-16 md:pr-[180px] lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px] md:max-w-none md:ml-6 lg:ml-12">
      <nav className="mb-12">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-medium mb-4">
          Writing
        </h1>
        <p className="text-lg text-muted-foreground">
          Thoughts on my work, my life, and the occasional tangent.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group p-6 -mx-6 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <Link href={`/writing/${post.slug}`} className="block space-y-2">
                <time className="text-sm font-mono text-muted-foreground">
                  {post.date}
                </time>
                <h2 className="font-display text-xl font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-8 rounded-lg border border-border/50 bg-muted/20">
            <p className="text-muted-foreground text-center">
              Posts are in the works. Check back soon.
            </p>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            In the meantime, you can find me on{" "}
            <a
              href="https://github.com/russellbomer"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      )}
    </article>
  );
}
