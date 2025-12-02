import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Demos",
  description: "Interactive demos and experiments.",
  pathname: "/demos",
});

// Placeholder for future demos
const demos: Array<{
  slug: string;
  title: string;
  description: string;
  status: "live" | "coming-soon";
}> = [
  {
    slug: "terminal",
    title: "Terminal Emulator",
    description:
      "A browser-based terminal experience showcasing CLI tools and workflows.",
    status: "live",
  },
];

export default function DemosPage() {
  return (
    <article id="main-content" className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
          Demos
        </h1>
        <p className="text-lg text-muted-foreground">
          Interactive experiments and proof-of-concepts.
        </p>
      </header>

      <div className="space-y-6">
        {demos.map((demo) => (
          <div
            key={demo.slug}
            className="group p-6 rounded-lg border border-border/50 bg-muted/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="font-display text-xl font-medium">
                  {demo.title}
                </h2>
                <p className="text-muted-foreground">{demo.description}</p>
              </div>
              {demo.status === "coming-soon" && (
                <span className="shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground/60 px-2 py-1 rounded border border-border/30">
                  Coming Soon
                </span>
              )}
            </div>
            {demo.status === "live" && (
              <Link
                href={`/demos/${demo.slug}`}
                className="inline-flex items-center gap-2 mt-4 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
              >
                Launch demo →
              </Link>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
