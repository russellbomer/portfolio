import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

type MetaInput = {
  title?: string;
  description?: string;
  pathname?: string;
  keywords?: string[];
  images?: string[]; // relative or absolute
};

export function buildMetadata(input: MetaInput = {}): Metadata {
  const title = input.title ? `${input.title} • ${site.name}` : site.name;
  const description = input.description || site.description;
  const url = absoluteUrl(input.pathname || "/");
  const images = (input.images || ["/images/placeholder.svg"]).map(absoluteUrl);
  const keywords = [
    ...new Set([...(input.keywords || []), ...site.defaultKeywords]),
  ];

  return {
    title,
    description,
    metadataBase: new URL(site.baseUrl),
    alternates: { canonical: url },
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: images.map((src) => ({ url: src, width: 1200, height: 630 })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
      creator: site.twitter,
    },
    robots: {
      index: true,
      follow: true,
    },
  } satisfies Metadata;
}
