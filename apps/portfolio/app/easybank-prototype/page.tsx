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
    <article
      id="main-content"
      className="[--edge-gap:1.5rem] [--pinwheel-space:0rem] md:[--edge-gap:2rem] md:[--pinwheel-space:10rem] lg:[--pinwheel-space:12rem] xl:[--pinwheel-space:22rem] 2xl:[--pinwheel-space:26rem] h-[100dvh] w-full overflow-hidden py-10 pl-[var(--edge-gap)] pr-[calc(var(--pinwheel-space)+var(--edge-gap))]"
    >
      <nav className="mb-8">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-6 space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-medium">
          Easybank UI Prototype
        </h1>
        <p className="text-base text-muted-foreground xl:text-lg">
          A quick interactive walkthrough of the banking app concept.
        </p>
      </header>

      <section className="inline-block max-w-full rounded-2xl border border-border/60 bg-muted/10 p-4 md:p-6">
        <div className="rounded-xl border border-border/40 bg-background/70 px-4 py-6 text-center text-sm text-muted-foreground md:hidden md:portrait:block">
          This prototype is best viewed on a desktop, laptop, or a tablet in
          landscape orientation.
        </div>
        <div className="hidden aspect-video w-[min(100%,calc((100dvh-18rem)*16/9))] overflow-hidden rounded-xl border border-border/40 bg-background md:block md:portrait:hidden">
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
