import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Easybank Flowchart",
  description: "Flowchart for the Easybank app project.",
  pathname: "/easybank-prototype/flowchart",
});

const FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=13-1311&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share";

export default function EasybankFlowchartPage() {
  return (
    <article id="main-content" className="h-[100dvh] w-full">
      <iframe
        title="Easybank flowchart"
        src={FIGMA_EMBED_URL}
        className="h-full w-full"
        allowFullScreen
      />
    </article>
  );
}
