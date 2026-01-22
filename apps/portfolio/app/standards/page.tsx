import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Standards",
  description:
    "Skills, expertise, and approach to building software that matters.",
  pathname: "/standards",
});

const skills = {
  languages: ["TypeScript", "Python", "JavaScript", "Go", "SQL", "HTML/CSS"],
  frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Vue.js"],
  backend: ["Node.js", "FastAPI", "Express", "Django", "PostgreSQL", "Redis"],
  tools: ["Docker", "Git", "AWS", "Vercel", "Linux", "Nginx"],
  practices: [
    "Test-Driven Development",
    "CI/CD",
    "Agile/Scrum",
    "Code Review",
    "Documentation",
  ],
};

const education = [
  {
    degree: "M.S. Software Engineering",
    institution: "Western Governors University",
    status: "In Progress",
    year: "Expected 2027",
  },
  {
    degree: "B.S.B.A. Supply Chain Management",
    institution: "Appalachian State University",
    status: "Completed",
    year: "2020",
  },
  {
    degree: "A.A. Culinary Arts",
    institution: "Central Piedmont Community College",
    status: "Completed",
    year: "2015",
  },
  {
    degree: "A.S. Business Administration",
    institution: "Central Piedmont Community College",
    status: "Completed",
    year: "2015",
  },
];

const principles = [
  {
    title: "Ship incrementally, validate early",
    description:
      "Small, frequent releases over big bang deployments. Get feedback before investing too heavily in any direction.",
  },
  {
    title: "Prefer simple over clever",
    description:
      "Code that's easy to read and maintain beats elegant abstractions that only you understand. Optimize for the next person.",
  },
  {
    title: "Document as you go",
    description:
      "Future you (and your teammates) will thank present you. Decisions, gotchas, and context matter as much as the code itself.",
  },
  {
    title: "Automate the boring parts",
    description:
      "If you do it twice, script it. Free up mental bandwidth for the work that actually requires human judgment.",
  },
  {
    title: "Design for humans first",
    description:
      "Technical constraints matter, but the end goal is always to reduce friction for the people using what you build.",
  },
];

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
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Languages
              </h3>
              <p className="text-foreground">{skills.languages.join(" · ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Frontend
              </h3>
              <p className="text-foreground">{skills.frontend.join(" · ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Backend
              </h3>
              <p className="text-foreground">{skills.backend.join(" · ")}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Tools & Infrastructure
              </h3>
              <p className="text-foreground">{skills.tools.join(" · ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Practices
              </h3>
              <p className="text-foreground">{skills.practices.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">How I Work</h2>
        <div className="space-y-6">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border/50 bg-muted/10"
            >
              <h3 className="font-display text-lg font-medium mb-2">
                {principle.title}
              </h3>
              <p className="text-muted-foreground">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-medium mb-6">Education</h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border/50 bg-muted/10"
            >
              <div>
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-mono text-muted-foreground">
                  {edu.year}
                </span>
                {edu.status === "In Progress" && (
                  <span className="block text-xs font-mono text-[hsl(var(--creamsicle))]">
                    {edu.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What I'm Looking For */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-medium mb-6">
          What I'm Looking For
        </h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground">
            I'm currently taking on freelance and consulting work while building
            my own products. I'm especially interested in:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Internal tools and operations software</li>
            <li>• Developer tooling and CLI applications</li>
            <li>• Data pipelines and integrations</li>
            <li>• Full-stack web applications with thoughtful UX</li>
          </ul>
          <p className="text-muted-foreground">
            I value clear communication, reasonable timelines, and projects
            where I can see the whole shape of the problem—from data modeling to
            user experience. Get in touch and we'll figure out how I can make
            your life a little easier.
          </p>
        </div>
      </section>

      <div className="pt-8 pb-[41px] border-t border-border/50">
        <p className="text-muted-foreground">
          Have a project that fits?{" "}
          <Link
            href="/connect"
            className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Let's talk about it.
          </Link>
        </p>
      </div>
    </article>
  );
}
