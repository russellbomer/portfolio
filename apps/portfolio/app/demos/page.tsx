import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Demos",
  description: "Interactive demos and experiments.",
  pathname: "/demos",
});

const demos: Array<{
  slug: string;
  title: string;
  description: string;
  tech: string[];
  status: "live" | "coming-soon";
  link?: {
    href: string;
    label: string;
    external?: boolean;
  };
}> = [
  {
    slug: "quarry",
    title: "Quarry",
    description:
      "A web scraping toolkit designed around simplicity. Foreman provides a fully guided, batteries-included tutorial. The wizard offers a customizable step-by-step workflow. Advanced users can drive the CLI directly with flags for full control.",
    tech: ["Python", "Typer", "Rich", "Pandas"],
    status: "live",
    link: {
      href: "https://quarry.russellbomer.com",
      label: "Try the demo",
      external: true,
    },
  },
];

export default function DemosPage() {
  return (
    <article id="main-content" className="mx-auto max-w-2xl px-6 py-16">
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
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
          Demos
        </h1>
        <p className="text-lg text-muted-foreground">
          Projects with live demos for your perusal.
        </p>
      </header>

      <div className="space-y-6">
        {demos.map((demo) => (
          <div
            key={demo.slug}
            className="group p-6 rounded-lg border border-border/50 hover:border-[hsl(var(--eucalyptus))] bg-muted/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-display text-xl font-medium">{demo.title}</h2>
              {demo.status === "coming-soon" && (
                <span className="shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground/60 px-2 py-1 rounded border border-border/30">
                  Coming Soon
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-4">{demo.description}</p>

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))]">
                {demo.tech.join(" · ")}
              </span>

              {demo.link && (
                <Link
                  href={demo.link.href}
                  target={demo.link.external ? "_blank" : undefined}
                  rel={demo.link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
                >
                  {demo.link.label}
                  {demo.link.external && <span className="text-xs">↗</span>}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
