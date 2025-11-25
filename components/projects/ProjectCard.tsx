import Link from "next/link";

export interface ProjectCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags?: string[];
  image?: { src: string; alt?: string };
  status?: "live" | "coming-soon" | "beta";
}

export function ProjectCard({
  slug,
  title,
  excerpt,
  tags = [],
  image,
  status = "live",
}: ProjectCardProps) {
  const statusMeta: Record<
    "coming-soon" | "beta",
    { label: string; className: string }
  > = {
    "coming-soon": {
      label: "Coming soon",
      className: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
    },
    beta: {
      label: "Beta",
      className:
        "bg-accent/10 text-accent-foreground ring-1 ring-inset ring-accent/20",
    },
  };

  const badgeKey = status !== "live" ? status : null;
  const statusBadge =
    badgeKey && badgeKey in statusMeta ? (
      <span
        className={`absolute right-4 top-4 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shadow-sm ${statusMeta[badgeKey].className}`}
      >
        {statusMeta[badgeKey].label}
      </span>
    ) : null;

  return (
    <article className="relative rounded-lg border bg-card text-card-foreground p-4 shadow-sm hover:shadow-md transition-shadow">
      {statusBadge}
      {image?.src ? (
        <img
          src={image.src}
          alt={image.alt ?? ""}
          className="mb-3 w-full rounded-md object-cover aspect-video"
          onError={(e) => {
            const t = e.currentTarget;
            if (t.dataset.fallback !== "1") {
              t.dataset.fallback = "1";
              t.src = "/images/placeholder.svg";
            }
          }}
        />
      ) : null}
      <h3 className="text-lg font-semibold mb-1">
        <Link href={`/projects/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground mb-3">{excerpt}</p>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2 text-sm">
          {tags.map((t) => (
            <li
              key={t}
              className="rounded bg-secondary text-secondary-foreground px-2 py-0.5"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
