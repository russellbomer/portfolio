import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Standards",
  description:
    "Skills, experience, and the principles that guide how I work.",
  pathname: "/standards",
});

export default function StandardsPage() {
  return (
    <article id="main-content" className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-12">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-medium mb-4">
          Standards
        </h1>
        <p className="text-lg text-muted-foreground">
          Skills, experience, and the principles that guide how I work.
        </p>
      </header>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">
          Technical Skills
        </h2>
        <div className="space-y-5 text-muted-foreground">
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Solution Design & Architecture
            </h3>
            <p>
              Requirements analysis · System design · Process automation · Workflow optimization · Technical roadmapping · Stakeholder communication
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">AI/ML Integration</h3>
            <p>
              Multi-model orchestration · MCP servers · RAG implementations · LLM-powered applications · Prompt engineering · Agent architectures
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Development</h3>
            <p>
              JavaScript/TypeScript · Python · React · Next.js · Node.js · SQL · REST APIs · ETL pipelines
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Data & Automation</h3>
            <p>
              Power Query · Power Pivot · VBA · Data modeling · Automated reporting · Dashboard design
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Infrastructure & Systems
            </h3>
            <p>
              Docker · Linux · Git/GitHub · CI/CD · Containerized services · Shell scripting
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Business & Operations</h3>
            <p>
              Cross-functional collaboration · Project management · Vendor coordination · P&amp;L analysis · Process improvement
            </p>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">How I Work</h2>
        <div className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Figure out the actual problem first
            </h3>
            <p>
              The requested solution and the needed solution are often different. I ask questions until I understand the real constraints and what success actually looks like.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Build iteratively but deliberately
            </h3>
            <p>
              Ship working solutions, gather real feedback, improve based on actual usage. Early doesn't mean sloppy—there's a plan, just not a rigid one.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Write for the next person
            </h3>
            <p>
              Code should be readable. Architectures should be understandable. Documentation should exist. Future me (or future someone else) shouldn't need an archaeology degree to figure out what's happening.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Use appropriate technology
            </h3>
            <p>
              Sometimes the right answer is React and Docker. Sometimes it's a Python script and a cron job. The goal is solving the problem, not demonstrating knowledge of frameworks.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Communicate across contexts
            </h3>
            <p>
              I've worked with executives who need clarity, not jargon, and technical teams who need details, not hand-waving. Translation between different kinds of expertise is part of the work.
            </p>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">Education</h2>
        <div className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-foreground font-medium">M.S. Software Engineering</h3>
            <p>Western Governors University</p>
            <p className="italic">2025 – Present (In Progress)</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium">B.S. Business Administration</h3>
            <p>Appalachian State University</p>
            <p className="italic">
              Supply Chain Management concentration, Sustainable Development minor
            </p>
            <p className="italic">2022 – 2024 | 3.5 GPA</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium">
              A.S. Business Administration · A.A. Culinary Arts
            </h3>
            <p>Central Piedmont Community College</p>
            <p className="italic">2018 – 2020 | 3.75 GPA</p>
          </div>
        </div>
      </section>

      {/* What I'm Looking For */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-medium mb-6">
          What I'm Looking For
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-muted-foreground">
            I'm open to full-time roles, contract work, and consulting
            engagements where complex problems need solving. I'm particularly
            interested in:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Solution architecture and systems design</li>
            <li>• AI/ML integration and implementation</li>
            <li>• Internal tools and automation</li>
            <li>• Data systems and business intelligence</li>
            <li>• Technical product management</li>
            <li>• Implementation consulting</li>
          </ul>
          <p className="text-muted-foreground">
            I value clear communication, understanding the business context, and
            working on problems that don't have predetermined solutions. I'm
            looking for work where the goal is building software that solves
            real problems, not following predetermined patterns.
          </p>
          <p className="text-muted-foreground">
            Remote-first positions strongly preferred. Based in Lawndale, North
            Carolina.
          </p>
        </div>
      </section>
    </article>
  );
}
