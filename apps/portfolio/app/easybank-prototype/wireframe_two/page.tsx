import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Easybank Wireframe Two",
  description: "Wireframe two for the Easybank app project.",
  pathname: "/easybank-prototype/wireframe_two",
});

const FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=13-1081&p=f&scaling=min-zoom&content-scaling=fixed&page-id=9%3A463&embed-host=share";

export default function EasybankWireframeTwoPage() {
  return (
    <article id="main-content" className="h-[100dvh] w-full">
      <iframe
        title="Easybank wireframe two"
        src={FIGMA_EMBED_URL}
        className="h-full w-full"
        allowFullScreen
      />
    </article>
  );
}
