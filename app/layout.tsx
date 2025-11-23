// MUST: Navigation/header/footer with clear site structure (1.2 scope)
// ASSUMPTION: Responsive design using Tailwind/ShadCN (1.2 assumptions)
// CONSTRAINT: Subdomain routing support; portable deploy (DO now, Hetzner later)
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Russell Bomer • Portfolio",
  description: "Interactive portfolio with live demos and project showcases.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">{children}</body>
    </html>
  );
}
