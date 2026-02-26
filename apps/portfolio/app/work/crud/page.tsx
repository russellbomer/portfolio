import Image from "next/image";
import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "CRUD — Case Study",
  description:
    "How I built a full-stack NFL analytics dashboard with EPA metrics, a Python/FastAPI backend, and a Next.js frontend.",
  pathname: "/work/crud",
});

export default function CrudCaseStudyPage() {
  return (
    <article
      id="main-content"
      className="mx-auto max-w-3xl px-8 py-16 md:pr-[180px] lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px] md:max-w-none md:ml-6 lg:ml-12"
    >
      <nav className="mb-12">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to work</span>
        </Link>
      </nav>

      <header className="mb-12">
        <p className="text-sm font-mono text-muted-foreground mb-3">Case Study</p>
        <h1 className="font-display text-3xl md:text-4xl font-medium mb-4">
          CRUD: Building a Full-Stack NFL Analytics Dashboard
        </h1>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {[
            "Python",
            "FastAPI",
            "Next.js",
            "PostgreSQL",
            "Recharts",
            "Neon",
            "Vercel",
            "Render",
          ].map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-14 text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            The Idea
          </h2>
          <p>
            I&apos;m a diehard NFL fan — a long-suffering Cleveland Browns fan,
            to be specific — and I&apos;ve always been drawn to the advanced
            metrics side of the game. Expected Points Added, completion
            probability, win probability — the numbers that tell you what&apos;s
            actually happening beyond the box score. At the same time, I wanted
            a portfolio project that would exercise real full-stack engineering
            skills: data pipelines, API design, database modeling, and a
            polished interactive frontend. An NFL analytics dashboard sat right
            at the intersection of those interests, and CRUD (Comprehensive
            Rankings and Unified Dashboard) was born.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            Tech Stack &amp; Architecture
          </h2>
          <div className="space-y-4">
            <p>
              The application is a classic three-tier architecture deployed
              across managed services:
            </p>
            <ul className="space-y-2 pl-4">
              <li>
                <strong className="text-foreground">Frontend:</strong> Next.js
                15 with TypeScript, Tailwind CSS, and Recharts, deployed on
                Vercel
              </li>
              <li>
                <strong className="text-foreground">Backend:</strong> Python
                with FastAPI, deployed on Render
              </li>
              <li>
                <strong className="text-foreground">Database:</strong>{" "}
                PostgreSQL on Neon (serverless)
              </li>
            </ul>
            <p>
              The data itself comes from{" "}
              <a
                href="https://nflverse.nflverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
              >
                nflverse
              </a>
              , an open-source collection of NFL play-by-play data distributed
              as Parquet files. Each season contains roughly 50,000 filtered
              plays across 48 columns — game situation, player IDs, EPA values,
              win probability, completion probability, and more.
            </p>
            <p>
              The pipeline works in three stages. A{" "}
              <strong className="text-foreground">fetch</strong> layer downloads
              Parquet and CSV files from nflverse&apos;s GitHub releases. An{" "}
              <strong className="text-foreground">ingest</strong> layer filters
              to only meaningful offensive plays (excluding kneels, spikes, and
              penalties without a snap), normalizes player identities across
              roster changes, and bulk-inserts into the{" "}
              <code className="font-mono text-sm">plays</code> table in chunks
              of 10,000. A{" "}
              <strong className="text-foreground">transform</strong> layer then
              runs pure SQL to compute aggregate tables — team stats by season
              and week, player stats across three roles (passer, rusher,
              receiver), and derived metrics like CPOE.
            </p>
            <p>
              One early decision that paid dividends throughout:{" "}
              <strong className="text-foreground">
                store EPA as totals, compute per-play at query time.
              </strong>{" "}
              If you store pre-computed averages and later need to combine across
              periods of different lengths, you get mathematically incorrect
              results — the classic &ldquo;averaging averages&rdquo; problem. By
              keeping raw totals in the database and dividing by{" "}
              <code className="font-mono text-sm">NULLIF(plays, 0)</code> in
              every query, the math is always correct regardless of how the data
              is sliced.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            What It Does
          </h2>
          <div className="space-y-4">
            <p>
              The dashboard serves several interconnected views, all filterable
              by season (2015–present), season type (regular/postseason), and an
              optional opponent-strength adjustment:
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-foreground font-medium mb-1">
                  League Overview
                </h3>
                <p>
                  A scatterplot of all 32 teams rendered with actual team logos
                  as data points, plotting offensive EPA/play against defensive
                  EPA/play. The axes are oriented so that the upper-right
                  quadrant represents elite teams (good offense and good
                  defense). Clicking any logo navigates to that team&apos;s
                  detail page. Below the chart, a sortable league table with
                  color-coded EPA values provides a tabular alternative.
                </p>
                <Image
                  src="/images/projects/crud/1.png"
                  alt="League Overview scatterplot with team logos as data points"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-lg border border-border/50 mt-4"
                />
                <Image
                  src="/images/projects/crud/2.png"
                  alt="League table with sortable, color-coded EPA values"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-lg border border-border/50 mt-3"
                />
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-1">
                  Team Detail
                </h3>
                <p>
                  A four-tab layout covering overview stats with league rank
                  badges, weekly trend charts with rolling averages, situational
                  splits (red zone, third down, short yardage, and more), and a
                  roster breakdown showing position-appropriate stats for QBs,
                  RBs, WRs, and TEs.
                </p>
                <Image
                  src="/images/projects/crud/3.png"
                  alt="Team Detail — overview tab with league rank badges"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-lg border border-border/50 mt-4"
                />
                <Image
                  src="/images/projects/crud/4.png"
                  alt="Team Detail — weekly trends tab with rolling average chart"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-lg border border-border/50 mt-3"
                />
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-1">
                  Player Rankings &amp; Detail
                </h3>
                <p>
                  Filterable, paginated player tables with position-aware column
                  rendering. Individual player pages show percentile bars against
                  the position group, Next Gen Stats, snap counts, week-by-week
                  performance, and field heatmaps for pass/run tendencies.
                </p>
                <Image
                  src="/images/projects/crud/5.png"
                  alt="Player rankings table with position-aware columns"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-lg border border-border/50 mt-4"
                />
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-1">
                  Game Detail
                </h3>
                <p>
                  EPA breakdown cards for both teams, a win probability chart
                  that traces the flow of the game play-by-play, drive summaries
                  in an accordion layout, and the five highest-leverage plays
                  highlighted as cards.
                </p>
                <Image
                  src="/images/projects/crud/6.png"
                  alt="Game Detail — win probability chart tracing play-by-play flow"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-lg border border-border/50 mt-4"
                />
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-1">
                  Team Comparison
                </h3>
                <p>
                  Side-by-side stat cards and bar charts for any two teams, plus
                  head-to-head results for the selected season.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            The Real Challenge: Scope Control
          </h2>
          <div className="space-y-4">
            <p>
              Most of the technical problems in this project were straightforward
              to solve. The genuinely hard part was deciding what{" "}
              <em>not</em> to build.
            </p>
            <p>
              NFL analytics is a rabbit hole. You could add situational splits by
              quarter, red zone target shares, pressure rate adjustments, receiver
              separation metrics, personnel grouping analysis — the list is
              effectively infinite. Each feature sounds reasonable in isolation,
              but the compound effect is a product that never ships.
            </p>
            <p>
              I addressed this by writing exhaustive planning documents before
              writing a line of application code. A constraints document
              established hard rules: the database schema is authoritative, API
              response shapes are locked to a contract, all queries live in a
              single file, no backend caching. A project plan defined explicit
              phases with concrete deliverables. A feature expansion document
              tracked what was in scope, what was deferred, and why.
            </p>
            <p>
              This planning infrastructure turned out to be the most valuable
              part of the project. Not because any individual constraint was
              profound, but because having them written down eliminated decision
              fatigue during implementation. When I was deep in building the
              player stats pipeline and thought &ldquo;I should also add target
              share percentages,&rdquo; I could check the plan, confirm it
              wasn&apos;t in scope, and move on. That discipline is what kept a
              two-week focused development sprint from ballooning into two months.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            Development Timeline
          </h2>
          <div className="space-y-4">
            <p>
              I built a bare-bones MVP a couple of months before the main
              development push — just enough to prove the data pipeline worked
              and render a basic league view. Then the project sat idle for a
              while. When I picked it back up, I committed to roughly two weeks
              of focused development that took it from prototype to finished
              product.
            </p>
            <p>
              The work progressed through defined phases: foundation (logging,
              health checks, test infrastructure), mobile responsiveness
              (collapsible sidebar, responsive grids), expanded player roles (the
              CTE union pattern for multi-position aggregation), UI/UX polish
              (skeleton loading states, accessibility attributes, per-page
              metadata), and DevOps (ETag caching, timing middleware, GitHub
              Actions for keep-alive pings and weekly data refreshes).
            </p>
            <p>
              The whole process was notably smooth. No marathon debugging
              sessions, no moments of wanting to throw the laptop. That&apos;s
              not because the project was trivial — it&apos;s because the upfront
              planning eliminated most of the ambiguity that usually causes
              friction. When you know exactly what table a query should hit, what
              shape the API response should be, and where the file should live
              before you start typing, implementation becomes mechanical in the
              best sense.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            Technical Highlights
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-foreground font-medium mb-1">
                Player aggregation via CTE unions
              </h3>
              <p>
                Rather than treating players as single-role, the transform layer
                runs three parallel CTEs — passer, rusher, and receiver —
                against the plays table, unions them, and groups by player. A
                dual-threat quarterback gets both passing and rushing stats
                populated. The frontend then renders position-appropriate columns
                based on the player&apos;s position group.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-medium mb-1">
                ETag middleware for client caching
              </h3>
              <p>
                Instead of server-side caching (which the constraints doc
                explicitly prohibits), the backend computes an MD5 hash of each
                JSON response body and returns it as an{" "}
                <code className="font-mono text-sm">ETag</code> header. On
                subsequent requests with{" "}
                <code className="font-mono text-sm">If-None-Match</code>, the
                server returns a{" "}
                <code className="font-mono text-sm">304</code> with no body.
                This keeps the backend stateless while still avoiding redundant
                data transfer.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-medium mb-1">
                Team logos as scatter plot data points
              </h3>
              <p>
                Recharts doesn&apos;t natively support image markers, so the
                scatter plot uses a custom{" "}
                <code className="font-mono text-sm">shape</code> render function
                that places SVG{" "}
                <code className="font-mono text-sm">&lt;image&gt;</code>{" "}
                elements at each data point&apos;s coordinates. The result is an
                immediately recognizable visualization — you can spot where your
                team sits at a glance without reading a legend.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-medium mb-1">
                Keep-alive workflow
              </h3>
              <p>
                Render&apos;s free tier spins down after inactivity, and Neon
                suspends idle compute. A GitHub Actions cron job pings the{" "}
                <code className="font-mono text-sm">/health</code> endpoint
                (which runs a{" "}
                <code className="font-mono text-sm">SELECT 1</code> against the
                database) every four minutes, keeping both services warm and
                ensuring the app loads quickly for visitors.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            Deployment
          </h2>
          <p>
            The app is live at{" "}
            <a
              href="https://crud.russellbomer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
            >
              crud.russellbomer.com
            </a>
            . The frontend deploys automatically from the main branch via Vercel.
            The backend runs on Render with the database hosted on Neon&apos;s
            serverless PostgreSQL. Data refreshes run weekly on Wednesdays via
            GitHub Actions, timed to when the NFL finalizes stat corrections from
            the previous week&apos;s games.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            Reflection
          </h2>
          <div className="space-y-4">
            <p>
              If I were starting over, I wouldn&apos;t change much. The
              systematic approach — plan first, constrain the scope, then execute
              — produced exactly the outcome I wanted. The thing I&apos;m most
              proud of isn&apos;t any single feature or clever query. It&apos;s
              the cohesive vision and the planning that made the development
              process smooth from start to finish. That&apos;s not visible to
              anyone visiting the site, but it&apos;s the skill that matters most
              in professional software development: the ability to define a clear
              scope, make deliberate architectural decisions, and ship a complete
              product without getting lost in the weeds.
            </p>
            <p>
              The project exercised architecture design and scope control more
              than any raw debugging ability — and honestly, those are harder
              muscles to build.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <a
          href="https://crud.russellbomer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-mono text-foreground hover:text-primary transition-colors"
        >
          View live ↗
        </a>
        <Link
          href="/work"
          className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to work
        </Link>
      </div>
    </article>
  );
}
