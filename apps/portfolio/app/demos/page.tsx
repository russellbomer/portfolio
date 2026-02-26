import type { ReactNode } from "react";
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
  description: ReactNode;
  tech: string[];
  status: "live" | "coming-soon";
  link?: {
    href: string;
    label: string;
    external?: boolean;
  };
  caseStudy?: {
    href: string;
    comingSoon?: boolean;
  };
}> = [
  {
    slug: "nfl-analytics",
    title: "CRUD (Comprehensive Rankings and Unified Dashboard)",
    description: (
      <>
        An NFL analytics dashboard that aggregates advanced metrics like EPA
        into a sharp interface. Yes, it&apos;s called CRUD on purpose. Data
        sourced from{" "}
        <a
          href="https://nflverse.nflverse.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 underline underline-offset-2 hover:text-foreground transition-colors"
        >
          NFLverse
        </a>
      </>
    ),
    tech: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Recharts", "Neon", "Vercel", "Render"],
    status: "live",
    link: {
      href: "https://crud.russellbomer.com",
      label: "View live",
      external: true,
    },
    caseStudy: {
      href: "/work/crud",
    },
  },
];

export default function DemosPage() {
  return (
    <article id="main-content" className="mx-auto max-w-3xl px-8 py-16 md:pr-[180px] lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px] md:max-w-none md:ml-6 lg:ml-12">
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
            className="relative group p-6 rounded-lg border border-border/50 hover:border-[hsl(var(--eucalyptus))] bg-muted/10 transition-colors"
          >
            {demo.link && (
              <a
                href={demo.link.href}
                target={demo.link.external ? "_blank" : undefined}
                rel={demo.link.external ? "noopener noreferrer" : undefined}
                className="absolute inset-0 rounded-lg"
                aria-hidden="true"
                tabIndex={-1}
              />
            )}
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
              <div className="flex flex-wrap gap-1.5">
                {demo.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {(demo.link || demo.caseStudy) && (
                <div className="relative z-10 flex items-center gap-3">
                  {demo.caseStudy && (
                    demo.caseStudy.comingSoon ? (
                      <span className="text-xs font-mono text-muted-foreground/50">
                        Case study coming soon
                      </span>
                    ) : (
                      <Link
                        href={demo.caseStudy.href}
                        className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        Case study
                        <span className="text-xs">↗</span>
                      </Link>
                    )
                  )}
                  {demo.caseStudy && !demo.caseStudy.comingSoon && demo.link && (
                    <span className="text-muted-foreground/40 text-xs select-none">|</span>
                  )}
                  {demo.link && (
                    <Link
                      href={demo.link.href}
                      target={demo.link.external ? "_blank" : undefined}
                      rel={demo.link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      {demo.link.label}
                      {demo.link.external && <span className="text-xs">↗</span>}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
