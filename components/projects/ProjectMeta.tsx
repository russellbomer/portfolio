export function ProjectMeta({ tech }: { tech?: string[] }) {
  if (!tech || tech.length === 0) return null;
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
      <ul className="flex flex-wrap gap-2 text-sm">
        {tech.map((t) => (
          <li
            key={t}
            className="rounded bg-muted px-2 py-0.5 text-muted-foreground"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
