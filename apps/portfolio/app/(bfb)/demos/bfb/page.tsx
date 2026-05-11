import { BFBHeader } from "./components/BFBHeader";
import { HeroSection } from "./components/HeroSection";
import { SupportBanner } from "./components/SupportBanner";
import { ContentSection } from "./components/ContentSection";
import { BodySection } from "./components/BodySection";
import { BFBFooter } from "./components/BFBFooter";

export default function BFBPage() {
  return (
    <>
      <BFBHeader />
      <div style={{ height: "138px" }} aria-hidden="true" />
      <main style={{ backgroundColor: "var(--bfb-bg)" }}>
        <HeroSection />
        <SupportBanner />
        <ContentSection
          heading="2026 NFL Draft"
          viewAllUrl="https://www.brownsfilmbreakdown.com/t/2026-nfl-draft"
        />
        <BodySection />
      </main>
      <BFBFooter />
    </>
  );
}
