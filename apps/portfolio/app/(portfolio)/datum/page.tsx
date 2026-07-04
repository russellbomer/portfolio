import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { buildMetadata } from "@/lib/seo/meta";
import { DatumHeader } from "./components/DatumHeader";
import { DatumHero } from "./components/DatumHero";
import { DatumServices } from "./components/DatumServices";
import { DatumHowItWorks } from "./components/DatumHowItWorks";
import { DatumWhoFor } from "./components/DatumWhoFor";
import { DatumAbout } from "./components/DatumAbout";
import { DatumContact } from "./components/DatumContact";
import { DatumFooter } from "./components/DatumFooter";
import { BackToPortfolioBadge } from "./components/BackToPortfolioBadge";
import { DatumParallaxRails } from "./components/DatumParallaxRails";
import { DatumSmoothScroll } from "./components/DatumSmoothScroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-datum-display",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Datum Home Systems",
  description:
    "Residential technology consulting and integration. Networks, media, automation, and security, run as one coordinated project.",
  baseUrl: "https://datum.russellbomer.com",
  pathname: "",
});

export default function DatumPage() {
  return (
    <DatumSmoothScroll>
      <div className={fraunces.variable}>
        <DatumParallaxRails />
        <main id="main-content">
          <DatumHeader />
          <DatumHero />
          <DatumServices />
          <DatumHowItWorks />
          <DatumWhoFor />
          <DatumAbout />
          <DatumContact />
        </main>
        <DatumFooter />
        <BackToPortfolioBadge />
      </div>
    </DatumSmoothScroll>
  );
}
