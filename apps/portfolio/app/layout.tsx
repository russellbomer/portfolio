import { InitialLoadProvider } from "@/components/providers/InitialLoadProvider";
import { GlobalDecor } from "@/components/layout/GlobalDecor";
import { RouteScrollSpring } from "@/components/motion/RouteScrollSpring";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import type { Metadata, Viewport } from "next";
import { Courier_Prime, Inter, Syne } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Russell Bomer | Full-Stack Engineer",
  description: "Software shaped by sawdust, music, and mise en place.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

// Body text - clean, legible sans-serif
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display/headings - bold geometric with character
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Monospace - vintage feel
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${syne.variable} ${courierPrime.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-background text-foreground font-mono antialiased">
        <InitialLoadProvider>
          <LoadingScreen />
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
          >
            Skip to main content
          </a>
          <RouteScrollSpring>{children}</RouteScrollSpring>
          <GlobalDecor />
        </InitialLoadProvider>
      </body>
    </html>
  );
}
