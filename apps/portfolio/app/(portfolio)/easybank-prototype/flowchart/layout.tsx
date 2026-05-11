import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Easybank Flowchart",
  description: "Flowchart for the Easybank app project.",
  pathname: "/easybank-prototype/flowchart",
});

export default function FlowchartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
