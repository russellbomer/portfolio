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
    <article id="main-content" className="h-[100dvh] w-full">
      <section className="hidden h-[100dvh] w-full md:landscape:block">
        <iframe
          title="Easybank UI Prototype"
          src={FIGMA_EMBED_URL}
          className="h-full w-full"
          allowFullScreen
        />
      </section>

      <section className="flex min-h-[100dvh] w-full flex-col px-6 py-16 md:px-12 md:landscape:hidden">
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
          <h1 className="font-display text-3xl sm:text-4xl font-medium">
            Easybank UI Prototype
          </h1>
          <p className="text-base text-muted-foreground">
            This prototype is best viewed on a desktop, laptop, or a tablet in
            landscape orientation.
          </p>
        </header>
      </section>
    </article>
  );
}
