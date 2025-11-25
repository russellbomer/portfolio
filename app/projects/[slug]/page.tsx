import { ProjectMeta } from "@/components/projects/ProjectMeta";
import { ScreenshotsGallery } from "@/components/projects/ScreenshotsGallery";
import { getProjectBySlug, loadProjects } from "@/lib/content/projects";
import { buildMetadata } from "@/lib/seo/meta";
import { absoluteUrl } from "@/lib/seo/site";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await loadProjects();
  return all.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) return {};
  const firstImage = project.screenshots?.[0]?.src
    ? [absoluteUrl(project.screenshots[0].src)]
    : undefined;
  return buildMetadata({
    title: project.title,
    description: project.excerpt,
    pathname: `/projects/${project.slug}`,
    images: firstImage,
    keywords: project.tags || project.tech,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) return notFound();

  const statusNotices: Record<"coming-soon" | "beta", string> = {
    "coming-soon":
      "This project is currently in development. A full case study and interactive demo will be published soon.",
    beta: "This project is in limited beta. Details may change as the experience evolves.",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">{project.title}</h1>
          <p className="text-muted-foreground">{project.excerpt}</p>
        </header>

        {project.status !== "live" ? (
          <div className="mb-6 rounded-md border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
            {statusNotices[project.status]}
          </div>
        ) : null}

        <p className="leading-7 whitespace-pre-line">{project.description}</p>
        <ProjectMeta tech={project.tech} />
        <ScreenshotsGallery screenshots={project.screenshots} />

        {project.demo?.url ? (
          <div className="mt-6">
            <a
              href={project.demo.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
            >
              Visit Demo
            </a>
          </div>
        ) : null}
      </article>
    </main>
  );
}
