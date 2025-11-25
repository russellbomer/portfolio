// MUST: Navigation/header/footer with clear site structure (1.2 scope)
// ASSUMPTION: Responsive design using Tailwind/ShadCN (1.2 assumptions)
// CONSTRAINT: Subdomain routing support; portable deploy (DO now, Hetzner later)
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AppThemeProvider from "@/components/theme/AppThemeProvider";
import { site } from "@/lib/seo/site";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s • ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.baseUrl),
  openGraph: {
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    creator: site.twitter,
  },
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
    <html lang="en" className={manrope.className}>
      <body className="min-h-[100dvh]">
        <AppThemeProvider>
          <Header />
          <main className="w-full px-6 md:px-10 lg:px-16 py-10">
            {children}
          </main>
          <Footer />
        </AppThemeProvider>
      </body>
    </html>
  );
}
