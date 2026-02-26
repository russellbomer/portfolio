import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Work",
  description: "A selection of projects and experiments, built with care.",
  pathname: "/work",
});

const projects: Array<{
  slug: string;
  title: string;
  description: ReactNode;
  tech: string[];
  status: "live" | "in-progress" | "coming-soon";
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
    slug: "portfolio",
    title: "Portfolio Site",
    description:
      "(This very site.) A Next.js/React application built from scratch — responsive design, fluid animations, accessible markup, and a clean component architecture.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    status: "live",
  },
  {
    slug: "nfl-analytics",
    title: "CRUD (Comprehensive Rankings and Unified Dashboard)",
    description: (
      <>
        An NFL analytics dashboard that aggregates advanced metrics
        like EPA with a sharp UI and abundant visualizations. Yes,
        it&apos;s called CRUD on purpose. Data sourced from{" "}
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

export default function WorkPage() {
  return (
    <article id="main-content" className="mx-auto max-w-3xl px-8 py-16 md:pr-[180px] lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px] md:max-w-none md:ml-6 lg:ml-12">
      <nav className="mb-12">
        <Link
          href="/home#work"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-medium mb-4">
          Work
        </h1>
        <p className="text-lg text-muted-foreground">
          Selected projects for your perusal, including live demos where noted.
        </p>
      </header>

      <div className="space-y-6">
        {projects.map((project) =>
          project.link && !project.caseStudy ? (
            <Link
              key={project.slug}
              href={project.link.href}
              target={project.link.external ? "_blank" : undefined}
              rel={project.link.external ? "noopener noreferrer" : undefined}
              className="group block p-6 rounded-lg border border-border/50 hover:border-[hsl(var(--eucalyptus))] bg-muted/10 transition-colors"
            >
              {/* Title and badge - stacked on mobile, row on md+ */}
              <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h2 className="font-display text-xl font-medium">
                  {project.title}
                </h2>
                {project.status === "coming-soon" && (
                  <span className="self-start shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground/60 px-2 py-1 rounded border border-border/30">
                    Coming Soon
                  </span>
                )}
                {project.status === "in-progress" && (
                  <span className="self-start shrink-0 text-xs font-mono uppercase tracking-wider text-[hsl(var(--creamsicle))] px-2 py-1 rounded border border-[hsl(var(--creamsicle)/0.3)]">
                    In Progress
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-4">{project.description}</p>

              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))]">
                  {project.tech.join(" · ")}
                </span>

                <span className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground">
                  {project.link.label}
                  {project.link.external && <span className="text-xs">↗</span>}
                </span>
              </div>
            </Link>
          ) : (
            <div
              key={project.slug}
              className="relative group p-6 rounded-lg border border-border/50 hover:border-[hsl(var(--eucalyptus))] bg-muted/10 transition-colors"
            >
              {project.link && (
                <a
                  href={project.link.href}
                  target={project.link.external ? "_blank" : undefined}
                  rel={project.link.external ? "noopener noreferrer" : undefined}
                  className="absolute inset-0 rounded-lg"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              )}
              {/* Title and badge - stacked on mobile, row on md+ */}
              <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h2 className="font-display text-xl font-medium">
                  {project.title}
                </h2>
                {project.status === "coming-soon" && (
                  <span className="self-start shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground/60 px-2 py-1 rounded border border-border/30">
                    Coming Soon
                  </span>
                )}
                {project.status === "in-progress" && (
                  <span className="self-start shrink-0 text-xs font-mono uppercase tracking-wider text-[hsl(var(--creamsicle))] px-2 py-1 rounded border border-[hsl(var(--creamsicle)/0.3)]">
                    In Progress
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-4">{project.description}</p>

              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))]">
                  {project.tech.join(" · ")}
                </span>
                {(project.link || project.caseStudy) && (
                  <div className="relative z-10 flex items-center gap-3">
                    {project.caseStudy && (
                      project.caseStudy.comingSoon ? (
                        <span className="text-xs font-mono text-muted-foreground/50">
                          Case study coming soon
                        </span>
                      ) : (
                        <Link
                          href={project.caseStudy.href}
                          className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                          Case study
                        </Link>
                      )
                    )}
                    {project.link && (
                      <Link
                        href={project.link.href}
                        target={project.link.external ? "_blank" : undefined}
                        rel={project.link.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        {project.link.label}
                        {project.link.external && <span className="text-xs">↗</span>}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-border/50">
        <p className="text-muted-foreground">
          Interested in working together?{" "}
          <Link
            href="/connect"
            className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Let's talk.
          </Link>
        </p>
      </div>
    </article>
  );
}
