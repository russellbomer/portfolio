import { getAllTags, getPublishedProjects } from "@/lib/content/projects";
import { buildMetadata } from "@/lib/seo/meta";
import ProjectsClient from "../../components/projects/ProjectsClient";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Projects",
  description: "Interactive demos and selected case studies.",
  pathname: "/projects",
});

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
