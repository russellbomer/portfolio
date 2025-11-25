export type DemoEntry = {
  key: string;
  title: string;
  description?: string;
  subdomain?: string; // e.g., terminal.russellbomer.com
  port?: number; // for local dev proxy if applicable
};

export const demos: DemoEntry[] = [
  {
    key: "terminal",
    title: "Terminal Demo",
    description:
      "Animated CLI walkthrough demonstrating setup steps and simple interactivity.",
    subdomain: "terminal.russellbomer.com",
  },
];

export function getDemoByKey(key: string): DemoEntry | undefined {
  return demos.find((d) => d.key === key);
}
