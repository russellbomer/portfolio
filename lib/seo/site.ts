export const site = {
  name: "Russell Bomer • Portfolio",
  description: "Interactive portfolio with live demos and project showcases.",
  author: "Russell Bomer",
  twitter: "@russellbomer",
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  defaultKeywords: [
    "portfolio",
    "software engineer",
    "next.js",
    "react",
    "typescript",
  ],
};

export function absoluteUrl(pathname = "/"): string {
  const base = site.baseUrl;
  if (pathname.startsWith("http")) return pathname;
  return `${base}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}
