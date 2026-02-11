import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Easybank Wireframe One",
  description: "Wireframe one for the Easybank app project.",
  pathname: "/easybank-prototype/wireframe_one",
});

const FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=3-445&p=f&scaling=min-zoom&content-scaling=fixed&page-id=3%3A443&embed-host=share";

export default function EasybankWireframeOnePage() {
  return (
    <article id="main-content" className="h-[100dvh] w-full">
      <iframe
        title="Easybank wireframe one"
        src={FIGMA_EMBED_URL}
        className="h-full w-full"
        allowFullScreen
      />
    </article>
  );
}
