import type { Metadata } from "next";

const siteConfig = {
  name: "Russell Bomer",
  description: "Software shaped by sawdust, music, and mise en place.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://russellbomer.com",
};

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
}

/**
 * Build consistent metadata for pages
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  pathname = "",
  image,
}: BuildMetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const url = `${siteConfig.url}${pathname}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export { siteConfig };
