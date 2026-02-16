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
                Writing a couple paragraphs to sum myself up is a difficult task; 
                I'm still pretty young but I have a rich and varied professional 
                history—running kitchens, coordinating supply chains for 
                large-scale manufacturing, leading enterprise software implementation— 
                but none of these alone really illustrate the breadth of my 
                experience or clarify the common threads underlying my work. 
              </p>
              <p>
                If I had to put it simply: I solve problems. To elaborate: I immerse 
                myself in a situation, identify weaknesses, and find solutions. I 
                value process, clarity, and continuous refinement; coincidentally, 
                I value creativity, resourcefulness, and experimentation just as 
                highly. These traits guide me in work and the rest of my life.
              </p>
              <p>
                Recently, I've been working frequently on solution architecture 
                and engineering, automation, data analysis and visualization, 
                and AI/ML integrations that run the gamut of my interests. I use 
                modern web development frameworks and tools— JavaScript/TypeScript, 
                Python, React, and Docker, for example— but I like to say I'm 
                stack agnostic. I also enjoy working with Linux-based systems, 
                shell scripting, the list goes on. The point is that I am adaptable
                 and choose my tools based on the problem rather than the reverse.
              </p>
              <p>
                At home, I do woodworking, DIY projects, and maintain a homelab. I suffer Cleveland Browns 
                football religiously, take lawn care more seriously than I probably should, and still cook 
                regularly. There are clear throughlines between my hobbies and work: I like building things 
                and making systems work better. As for the Browns, the throughline is that no matter how 
                difficult something is, I am devoted to seeing it through.
              </p>
              <p>
                I'm permanently located in rural western North Carolina with my wife, 2 dogs, and 2 cats 
                (not to mention a lot of pet fish). I'm in the process of finishing my M.S. in Software 
                Engineering at WGU. I'm open to work and would love to discuss the ways I can help you 
                solve a problem, so drop me a line and I'll get back to you promptly!
              </p>
            </div>
          </div>
        </ScrollSection>

        {/* Standards Section */}
        <ScrollSection
          id="standards"
          className="px-6 md:px-12 lg:pl-32 lg:pr-24"
        >
          <div className="max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              Standards
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
            <div className="mt-8">
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
            </div>

            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-lg font-medium text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))] hover:text-[hsl(var(--eucalyptus))] dark:hover:text-[hsl(var(--fern))] transition-colors"
            >
              Check out more
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

        {/* Spacer for pinwheel alignment */}
        <div className="h-[267px]" aria-hidden="true" />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
