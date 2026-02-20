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
    <article id="main-content" className="mx-auto max-w-3xl px-8 py-16 md:pr-[180px] lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px] md:max-w-none md:ml-6 lg:ml-12">
      <nav className="mb-12">
        <Link
          href="/home#standards"
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
              Solution Design &amp; Analysis
            </h3>
            <p>
              Requirements gathering · Stakeholder interviews · Process mapping
              · Gap analysis · Technical roadmapping · Build-vs-buy evaluation ·
              Workflow optimization
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Development</h3>
            <p>
              JavaScript/TypeScript · Python · React · Next.js · FastAPI ·
              Node.js · SQL · REST APIs · ETL pipelines · VBA
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Data &amp; Analytics
            </h3>
            <p>
              PostgreSQL · SQLite · Power BI · Power Query · Power Pivot · Excel
              (advanced) · Data modeling · Dashboard design · Automated reporting
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Infrastructure &amp; Tools
            </h3>
            <p>
              Docker · Linux · Git/GitHub · GitHub Actions · CI/CD · JDE/AS400 ·
              Figma · Jira · Notion
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              AI/ML Integration
            </h3>
            <p>
              LLM-assisted development workflows · MCP server configuration ·
              RAG implementations · Prompt engineering
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Business Operations
            </h3>
            <p>
              Supply chain planning · Procurement · Vendor management · P&amp;L
              analysis · Lean/Six Sigma · Kaizen facilitation · Change
              management
            </p>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">Approach</h2>
        <div className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Systems thinking applies everywhere
            </h3>
            <p>
              Kitchens, supply chains, and codebases all break down the same way
              — unclear ownership, missing feedback loops, and assumptions that
              go unexamined. I look for the structural problem underneath the
              visible one.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              The right solution depends on the real constraints
            </h3>
            <p>
              Sometimes the answer is a full-stack application. Sometimes
              it&apos;s a spreadsheet with good conditional logic. I choose tools
              based on what the situation actually requires, not what&apos;s most
              impressive on paper.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Adoption is the metric
            </h3>
            <p>
              Building something is the easy part. Getting people to use it — and
              keep using it — requires understanding their work, involving them
              early, and documenting everything for whoever comes next.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">
              Operational fluency is a technical skill
            </h3>
            <p>
              Understanding how a business actually runs — the processes, the
              pressures, the politics — is the difference between building a
              product and developing a solution.
            </p>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">Education</h2>
        <div className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-foreground font-medium">
              M.S. Software Engineering
            </h3>
            <p>Western Governors University</p>
            <p className="italic">2025 – Present (In Progress)</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium">
              B.S. Business Administration
            </h3>
            <p>Appalachian State University</p>
            <p className="italic">
              Supply Chain Management concentration, Sustainable Development
              minor
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
          What I&apos;m Looking For
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-muted-foreground">
            I&apos;m open to full-time roles, contract work, and consulting
            engagements where complex problems need solving. I&apos;m
            particularly interested in:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Business systems analysis and process improvement</li>
            <li>• Solution architecture and systems design</li>
            <li>• AI/ML integration and implementation</li>
            <li>• Internal tools and automation</li>
            <li>• Data systems and business intelligence</li>
            <li>• Technical product management</li>
          </ul>
          <p className="text-muted-foreground">
            I value clear communication, understanding the business context, and
            working on problems that don&apos;t have predetermined solutions.
            I&apos;m looking for work where the goal is building software that
            solves real problems, not following predetermined patterns.
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
