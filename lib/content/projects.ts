import fs from "node:fs/promises";
import path from "node:path";
import "server-only";
import { z } from "zod";

export const Screenshot = z.object({
  src: z.string(),
  alt: z.string().default(""),
});

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  tech: z.array(z.string()).default([]),
  screenshots: z.array(Screenshot).default([]),
  demo: z
    .object({
      subdomain: z.string().optional(),
      url: z.string().url().optional(),
    })
    .default({}),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type Project = z.infer<typeof Project>;

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export async function loadProjects(): Promise<Project[]> {
  const files = await fs.readdir(PROJECTS_DIR);
  const items = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(PROJECTS_DIR, file), "utf8");
        const parsed = JSON.parse(raw);
        return Project.parse(parsed);
      })
  );
  return items;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await loadProjects();
  return all.filter((p) => p.published);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await loadProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllTags(): Promise<string[]> {
  const all = await loadProjects();
  const tags = new Set<string>();
  all.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
