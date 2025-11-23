import { getProjectBySlug } from '@/lib/content/projects'
import { notFound } from 'next/navigation'
import { ProjectMeta } from '@/components/projects/ProjectMeta'
import { ScreenshotsGallery } from '@/components/projects/ScreenshotsGallery'

interface Params {
  params: { slug: string }
}

export async function generateStaticParams() {
  // Light fallback; pages will be generated on demand if not prelisted
  return []
}

export default async function ProjectDetailPage({ params }: Params) {
  const project = await getProjectBySlug(params.slug)
  if (!project || !project.published) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">{project.title}</h1>
          <p className="text-muted-foreground">{project.excerpt}</p>
        </header>

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
  )
}
