import Link from "next/link";

export interface ProjectCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags?: string[];
  image?: { src: string; alt?: string };
}

export function ProjectCard({
  slug,
  title,
  excerpt,
  tags = [],
  image,
}: ProjectCardProps) {
  return (
    <article className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm hover:shadow-md transition-shadow">
      {image?.src ? (
        <img
          src={image.src}
          alt={image.alt ?? ""}
          className="mb-3 w-full rounded-md object-cover aspect-video"
        />
      ) : null}
      <h3 className="text-lg font-semibold mb-1">
        <Link href={`/projects/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground mb-3">{excerpt}</p>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2 text-xs text-foreground/80">
          {tags.map((t) => (
            <li key={t} className="rounded bg-secondary px-2 py-0.5">
              {t}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
