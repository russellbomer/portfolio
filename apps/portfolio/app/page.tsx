import Footer from "@/components/layout/Footer";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { SectionCenterNudge } from "@/components/motion/SectionCenterNudge";
import { ScrollProgressRail } from "@/components/motion/ScrollProgressRail";
import { ScrollSection } from "@/components/motion/ScrollSection";
import { HeroContent } from "@/components/sections/HeroContent";
import { ScrollLinkedAbout } from "@/components/sections/ScrollLinkedAbout";
import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: undefined, // Use site name only for homepage
  description:
    "Full-stack engineer crafting thoughtful software with precision and care.",
  pathname: "/",
});

export default function LandingPage() {
  return (
    <>
      <SidebarNav />
      <ScrollProgressRail />
      <SectionCenterNudge />
      <main id="main-content">
        {/* Hero Section */}
        <ScrollSection
          id="hero"
          className="px-8 md:px-12 md:pr-[180px] lg:pl-24 lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px]"
          isFirst
        >
          <HeroContent />
        </ScrollSection>

        {/* About Section - scroll-linked content */}
        <ScrollLinkedAbout className="px-8 md:px-12 md:pr-[180px] lg:pl-24 lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px]" />

        {/* Standards Section */}
        <ScrollSection
          id="standards"
          className="px-8 md:px-12 md:pr-[180px] lg:pl-24 lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px]"
        >
          <div className="max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
              Standards
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-display text-xl font-medium">
                  What I Do
                </h3>
                <ul className="space-y-1 text-muted-foreground leading-snug">
                  <li>• Business systems analysis &amp; process improvement</li>
                  <li>• Solution architecture &amp; systems design</li>
                  <li>• Data pipelines &amp; reporting systems</li>
                  <li>• Internal tools &amp; business intelligence</li>
                  <li>• AI/ML integration &amp; automation</li>
                  <li>• Full-stack web applications</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-medium">Approach</h3>
                <ul className="space-y-1 text-muted-foreground leading-snug">
                  <li>• Systems thinking applies everywhere</li>
                  <li>• The right solution depends on the real constraints</li>
                  <li>• Adoption is the metric</li>
                  <li>• Operational fluency is a technical skill</li>
                </ul>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="font-display text-xl font-medium mb-3">
                Current Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "JavaScript/TypeScript",
                  "Python",
                  "React",
                  "Next.js",
                  "FastAPI",
                  "Node.js",
                  "SQL",
                  "Docker",
                  "Linux",
                  "Power BI",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/standards"
                className="text-sm font-mono text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))] hover:text-[hsl(var(--eucalyptus))] dark:hover:text-[hsl(var(--fern))] transition-colors"
              >
                The full picture →
              </Link>
            </div>
          </div>
        </ScrollSection>

        {/* Work Section */}
        <ScrollSection id="work" className="px-8 md:px-12 md:pr-[180px] lg:pl-24 lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px]">
          <div className="max-w-4xl w-full">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
              Work
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              A selection of projects and experiments. Some shipped, some in
              progress, all built with care.
            </p>

            {/* Featured Projects */}
            <div className="grid gap-4 mb-6">
              <div className="group p-4 rounded-lg border border-[hsl(var(--rust)/0.3)] hover:border-[hsl(var(--eucalyptus))] transition-colors">
                <h3 className="font-display text-xl font-medium mb-1">
                  Portfolio Site
                </h3>
                <p className="text-muted-foreground mb-2">
                  (This very site.) A Next.js/React application built from
                  scratch — responsive design, fluid animations, accessible
                  markup, and a clean component architecture.
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {["Next.js", "TypeScript", "Tailwind"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="https://github.com/russellbomer/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:text-primary/80 transition-colors shrink-0"
                  >
                    See the source
                    <span className="text-xs">↗</span>
                  </Link>
                </div>
              </div>
              <div className="group p-4 rounded-lg border border-[hsl(var(--rust)/0.3)] hover:border-[hsl(var(--eucalyptus))] transition-colors">
                <h3 className="font-display text-xl font-medium mb-1">
                  CRUD (Comprehensive Rankings and Unified Dashboard)
                </h3>
                <p className="text-muted-foreground mb-2">
                  An NFL analytics dashboard that aggregates advanced metrics
                  like EPA with a sharp UI and abundant visualizations. Yes,
                  it&apos;s called CRUD on purpose. Data sourced from{" "}
                  <a
                    href="https://nflverse.nflverse.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    NFLverse
                  </a>
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {["Python", "React", "Recharts", "PostgreSQL"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href="https://crud.russellbomer.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))] hover:text-[hsl(var(--eucalyptus))] dark:hover:text-[hsl(var(--fern))] transition-colors"
                    >
                      View live
                      <span className="text-xs">↗</span>
                    </Link>
                    <Link
                      href="/work/crud"
                      className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Case study
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href="/RBomer - Resume (021926 Portfolio).pdf"
                download
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium font-mono bg-[hsl(var(--fern))] dark:bg-[hsl(var(--rust))] text-white hover:bg-[hsl(var(--eucalyptus))] dark:hover:bg-[hsl(var(--creamsicle))] transition-colors"
              >
                Download Resume
                <span className="text-base">↓</span>
              </a>
            </div>
          </div>
        </ScrollSection>

        {/* Connect Section */}
        <ScrollSection
          id="connect"
          className="px-8 md:px-12 md:pr-[180px] lg:pl-24 lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px]"
          isLast
        >
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-8">
              Let's Build Something
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have a project in mind? Looking for a collaborator? I'm always
              interested in hearing about interesting problems worth solving.
            </p>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-lg font-medium bg-[hsl(var(--fern))] dark:bg-[hsl(var(--rust))] text-white hover:bg-[hsl(var(--eucalyptus))] dark:hover:bg-[hsl(var(--creamsicle))] transition-colors"
            >
              Drop me a line
            </Link>
          </div>
        </ScrollSection>

        {/* Spacer for pinwheel alignment */}
        <div className="h-[380px]" aria-hidden="true" />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
