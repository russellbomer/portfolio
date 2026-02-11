import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Easybank UI Prototype",
  description: "An interactive banking app UI prototype built in Figma.",
  pathname: "/easybank-prototype",
});

const FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=22-4&p=f&scaling=min-zoom&content-scaling=fixed&page-id=13%3A1142&starting-point-node-id=22%3A4&embed-host=share";

export default function EasybankPrototypePage() {
  return (
    <article id="main-content" className="mx-auto max-w-5xl px-6 py-16">
      <nav className="mb-10">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-10 space-y-3">
        <h1 className="font-display text-4xl md:text-5xl font-medium">
          Easybank UI Prototype
        </h1>
        <p className="text-lg text-muted-foreground">
          A quick interactive walkthrough of the banking app concept.
        </p>
      </header>

      <section className="rounded-2xl border border-border/60 bg-muted/10 p-4 md:p-6">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/40 bg-background">
          <iframe
            title="Easybank UI Prototype"
            src={FIGMA_EMBED_URL}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      </section>
    </article>
  );
}
