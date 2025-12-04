import Footer from "@/components/layout/Footer";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { ScrollSection } from "@/components/motion/ScrollSection";
import { HeroContent } from "@/components/sections/HeroContent";
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
      <main id="main-content">
        {/* Hero Section */}
        <ScrollSection
          id="hero"
          className="px-6 md:px-12 lg:pl-32 lg:pr-24"
          isFirst
        >
          <HeroContent />
        </ScrollSection>

        {/* About Section */}
        <ScrollSection id="about" className="px-6 md:px-12 lg:pl-32 lg:pr-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              About
            </h2>
            <div className="space-y-6 text-md text-muted-foreground">
              <p>
                I’m a full-stack engineer who believes good software starts with
                paying attention—to people, to constraints, and to the small
                details that determine whether something feels natural or
                frustrating. I’m drawn to making complex systems understandable,
                where usefulness and beauty support each other rather than
                compete.
              </p>
              <p>
                I work from the belief that design is a human act before it’s a
                technical one. Tools should lighten the load, reduce confusion,
                and respect the way people actually live. That principle guides
                the problems I choose and how I approach them.
              </p>
              <p>
                The constants in my life— cooking (lately, a lot of sourdough),
                woodworking, art in all its forms, and the people closest to me—
                have shaped how I build. They’ve taught me patience, attention
                to detail, and an appreciation for simplicity and elegance that
                carries directly into my work.
              </p>
              <p>
                And because life demands a sense of humor, I’m also a lifelong
                Cleveland Browns fan. If nothing else, it’s taught me
                resilience, loyalty, and consistency in what you believe.
                They’ll definitely win a Super Bowl in my lifetime;{" "}
                <span className="italic-sentence">I'm sure of it.</span>
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/tmi"
                className="text-sm font-mono text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))] hover:text-[hsl(var(--eucalyptus))] dark:hover:text-[hsl(var(--fern))] transition-colors"
              >
                The longer version →
              </Link>
            </div>
          </div>
        </ScrollSection>

        {/* Practice Section */}
        <ScrollSection
          id="practice"
          className="px-6 md:px-12 lg:pl-32 lg:pr-24"
        >
          <div className="max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              The Practice
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium">
                  What I Build
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Full-stack web applications</li>
                  <li>• Interactive dashboards & data visualization tools</li>
                  <li>• Robust CLI experiences & developer tooling</li>
                  <li>• API integrations & backend systems</li>
                  <li>• AI/LLM application integrations</li>
                  <li>• Containerized & cloud-native solutions</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium">How I Work</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Ship incrementally, validate early</li>
                  <li>• Document as I go</li>
                  <li>• Prefer simple over clever</li>
                  <li>• Automate the boring parts</li>
                </ul>
              </div>
            </div>
            <div className="mt-12">
              <h3 className="font-display text-xl font-medium mb-4">
                Current Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "React",
                  "Next.js",
                  "Node.js",
                  "PostgreSQL",
                  "Redis",
                  "Docker",
                  "AWS",
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
          </div>
        </ScrollSection>

        {/* Work Section */}
        <ScrollSection id="work" className="px-6 md:px-12 lg:pl-32 lg:pr-24">
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
              </div>

              <div className="group p-4 rounded-lg border border-[hsl(var(--rust)/0.3)] hover:border-[hsl(var(--eucalyptus))] transition-colors">
                <h3 className="font-display text-xl font-medium mb-1">
                  Quarry
                </h3>
                <p className="text-muted-foreground mb-2">
                  A web scraping toolkit designed around simplicity. Foreman
                  provides a fully guided, batteries-included tutorial. The
                  wizard offers a customizable step-by-step workflow. Advanced
                  users can drive the CLI directly with flags for full control.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "Typer", "Rich", "Pandas"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-lg font-medium text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))] hover:text-[hsl(var(--eucalyptus))] dark:hover:text-[hsl(var(--fern))] transition-colors"
            >
              Explore the Work
              <span className="text-xl">→</span>
            </Link>
          </div>
        </ScrollSection>

        {/* Connect Section */}
        <ScrollSection
          id="connect"
          className="px-6 md:px-12 lg:pl-32 lg:pr-24"
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

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
