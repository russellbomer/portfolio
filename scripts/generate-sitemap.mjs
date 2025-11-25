import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

async function getProjectSlugs() {
  const files = await fs.readdir(PROJECTS_DIR);
  const slugs = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(PROJECTS_DIR, f), "utf8");
    try {
      const json = JSON.parse(raw);
      if (json?.published !== false && json?.slug) slugs.push(json.slug);
    } catch {}
  }
  return slugs.sort();
}

function url(loc, priority = 0.6) {
  const lastmod = new Date().toISOString();
  return `<url><loc>${BASE_URL}${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
}

async function writeSitemap() {
  const staticPaths = ["/", "/projects", "/demos", "/contact"];
  const projectSlugs = await getProjectSlugs();
  const projectPaths = projectSlugs.map((s) => `/projects/${s}`);

  const urls = [
    ...staticPaths.map((p) => url(p, p === "/" ? 1.0 : 0.8)),
    ...projectPaths.map((p) => url(p, 0.7)),
  ].join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf8");
  await fs.writeFile(
    path.join(PUBLIC_DIR, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`,
    "utf8"
  );
  console.log("Sitemap and robots.txt generated.");
}

writeSitemap().catch((err) => {
  console.error(err);
  process.exit(1);
});
