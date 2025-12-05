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
  description: string;
  tech: string[];
  status: "live" | "in-progress" | "coming-soon";
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
  {
    slug: "portfolio",
    title: "Portfolio Site",
    description:
      "(This very site.) A Next.js/React application built from scratch — responsive design, fluid animations, accessible markup, and a clean component architecture.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    status: "live",
    link: {
      href: "https://github.com/russellbomer/portfolio",
      label: "See the source",
      external: true,
    },
  },
  {
    slug: "nfl-analytics",
    title: "NFL Analytics Dashboard",
    description:
      "Interactive data visualization for NFL statistics and trends. Deep dives into player performance, team metrics, and historical analysis.",
    tech: ["Python", "React", "D3.js", "PostgreSQL"],
    status: "coming-soon",
  },
  {
    slug: "simplytics",
    title: "Simplytics API",
    description:
      "A lightweight analytics API for developers who want insights without the complexity. Simple integration, powerful data.",
    tech: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    status: "coming-soon",
  },
];

export default function WorkPage() {
  return (
    <article id="main-content" className="mx-auto max-w-3xl px-6 py-16">
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
          Work
        </h1>
        <p className="text-lg text-muted-foreground">
          Selected projects for your perusal, including live demos where noted.
        </p>
      </header>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group p-6 rounded-lg border border-border/50 hover:border-[hsl(var(--eucalyptus))] bg-muted/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-display text-xl font-medium">
                {project.title}
              </h2>
              {project.status === "coming-soon" && (
                <span className="shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground/60 px-2 py-1 rounded border border-border/30">
                  Coming Soon
                </span>
              )}
              {project.status === "in-progress" && (
                <span className="shrink-0 text-xs font-mono uppercase tracking-wider text-[hsl(var(--creamsicle))] px-2 py-1 rounded border border-[hsl(var(--creamsicle)/0.3)]">
                  In Progress
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-4">{project.description}</p>

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))]">
                {project.tech.join(" · ")}
              </span>

              {project.link && (
                <Link
                  href={project.link.href}
                  target={project.link.external ? "_blank" : undefined}
                  rel={
                    project.link.external ? "noopener noreferrer" : undefined
                  }
                  className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
                >
                  {project.link.label}
                  {project.link.external && <span className="text-xs">↗</span>}
                </Link>
              )}
            </div>
          </div>
        ))}
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
