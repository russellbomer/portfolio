import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Home",
  description: "Explore interactive demos and case studies from Russell Bomer.",
  pathname: "/",
});

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Builder of practical, resilient tooling
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          I design and ship products with strong UX and pragmatic engineering.
          Explore interactive demos and case studies, or reach out to
          collaborate.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          View Projects
        </Link>
        <Link
          href="/demos"
          className="inline-flex items-center rounded-md border px-4 py-2"
        >
          Try Demos
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md border px-4 py-2"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
