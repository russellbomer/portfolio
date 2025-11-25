"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import type { Project as ProjectType } from "@/lib/content/projects";

export default function ProjectsClient({
  initialProjects,
  allTags,
}: {
  initialProjects: ProjectType[];
  allTags: string[];
}) {
  const availableProjects = initialProjects.filter(
    (project) => project.status !== "coming-soon"
  );
  const comingSoonProjects = initialProjects.filter(
    (project) => project.status === "coming-soon"
  );

  return (
    <div>
      <ProjectFilter
        allTags={allTags}
        onChange={(active) => {
          const list = document.querySelectorAll<HTMLElement>(
            "[data-project-tags]"
          );
          list.forEach((el) => {
            const tags = (el.dataset.tags ?? "").split(",").filter(Boolean);
            const show =
              active.length === 0 || active.every((t) => tags.includes(t));
            el.style.display = show ? "" : "none";
          });
        }}
      />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {availableProjects.map((project) => (
          <div
            key={project.slug}
            data-project-tags={project.tags.join(",")}
            data-tags={project.tags.join(",")}
            className="h-full"
          >
            <ProjectCard
              slug={project.slug}
              title={project.title}
              excerpt={project.excerpt}
              tags={project.tags}
              image={project.screenshots[0]}
              status={project.status}
            />
          </div>
        ))}
      </section>

      {availableProjects.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No published projects match those filters yet.
        </p>
      ) : null}

      {comingSoonProjects.length > 0 ? (
        <section className="mt-12">
          <div className="rounded-2xl border border-dashed border-border p-6 md:p-8 bg-muted/20">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                  In progress
                </div>
                <h2 className="mt-3 text-2xl font-semibold">
                  Coming soon projects
                </h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;re actively building these experiences. Join the
                  waitlist or check back soon for launch updates.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {comingSoonProjects.map((project) => (
                <article
                  key={project.slug}
                  className="flex h-full flex-col justify-between rounded-xl border border-dashed border-primary/20 bg-background/80 p-5 shadow-sm"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Coming soon
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {project.excerpt}
                    </p>
                  </div>
                  {project.tags.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2 text-xs">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-primary"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
