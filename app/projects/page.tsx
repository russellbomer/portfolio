import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { getAllTags, getPublishedProjects } from "@/lib/content/projects";

export const dynamic = "force-static";

export default async function ProjectsPage() {
  const [projects, tags] = await Promise.all([
    getPublishedProjects(),
    getAllTags(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="text-muted-foreground">
          Interactive demos and selected case studies.
        </p>
      </header>

      <ProjectsClient initialProjects={projects} allTags={tags} />
    </main>
  );
}

function ProjectsClient({
  initialProjects,
  allTags,
}: {
  initialProjects: Awaited<ReturnType<typeof getPublishedProjects>>;
  allTags: string[];
}) {
  // Client boundary for filters
  return (
    <div>
      <ProjectFilter
        allTags={allTags}
        onChange={(active) => {
          const list = document.querySelectorAll<HTMLElement>("[data-tags]");
          list.forEach((el) => {
            const tags = (el.dataset.tags ?? "").split(",").filter(Boolean);
            const show =
              active.length === 0 || active.every((t) => tags.includes(t));
            el.style.display = show ? "" : "none";
          });
        }}
      />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialProjects.map((p) => (
          <div key={p.slug} data-tags={p.tags.join(",")}>
            <ProjectCard
              slug={p.slug}
              title={p.title}
              excerpt={p.excerpt}
              tags={p.tags}
              image={p.screenshots[0]}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
