# CRUD: Building a Full-Stack NFL Analytics Dashboard

## The Idea

I'm a diehard NFL fan — a long-suffering Cleveland Browns fan, to be specific — and I've always been drawn to the advanced metrics side of the game. Expected Points Added, completion probability, win probability — the numbers that tell you what's actually happening beyond the box score. At the same time, I wanted a portfolio project that would exercise real full-stack engineering skills: data pipelines, API design, database modeling, and a polished interactive frontend. An NFL analytics dashboard sat right at the intersection of those interests, and CRUD (Comprehensive Rankings and Unified Dashboard) was born.

## Tech Stack & Architecture

The application is a classic three-tier architecture deployed across managed services:

- **Frontend:** Next.js 15 with TypeScript, Tailwind CSS, and Recharts, deployed on Vercel
- **Backend:** Python with FastAPI, deployed on Render
- **Database:** PostgreSQL on Neon (serverless)

The data itself comes from [nflverse](https://github.com/nflverse), an open-source collection of NFL play-by-play data distributed as Parquet files. Each season contains roughly 50,000 filtered plays across 48 columns — game situation, player IDs, EPA values, win probability, completion probability, and more.

The pipeline works in three stages. A **fetch** layer downloads Parquet and CSV files from nflverse's GitHub releases. An **ingest** layer filters to only meaningful offensive plays (excluding kneels, spikes, and penalties without a snap), normalizes player identities across roster changes, and bulk-inserts into the `plays` table in chunks of 10,000. A **transform** layer then runs pure SQL to compute aggregate tables — team stats by season and week, player stats across three roles (passer, rusher, receiver), and derived metrics like CPOE.

One early decision that paid dividends throughout: **store EPA as totals, compute per-play at query time.** If you store pre-computed averages and later need to combine across periods of different lengths, you get mathematically incorrect results — the classic "averaging averages" problem. By keeping raw totals in the database and dividing by `NULLIF(plays, 0)` in every query, the math is always correct regardless of how the data is sliced.

## What It Does

The dashboard serves several interconnected views, all filterable by season (2015–present), season type (regular/postseason), and an optional opponent-strength adjustment:

**League Overview** — A scatterplot of all 32 teams rendered with actual team logos as data points, plotting offensive EPA/play against defensive EPA/play. The axes are oriented so that the upper-right quadrant represents elite teams (good offense and good defense). Clicking any logo navigates to that team's detail page. Below the chart, a sortable league table with color-coded EPA values provides a tabular alternative.

**Team Detail** — A four-tab layout covering overview stats with league rank badges, weekly trend charts with rolling averages, situational splits (red zone, third down, short yardage, and more), and a roster breakdown showing position-appropriate stats for QBs, RBs, WRs, and TEs.

**Player Rankings & Detail** — Filterable, paginated player tables with position-aware column rendering. Individual player pages show percentile bars against the position group, Next Gen Stats, snap counts, week-by-week performance, and field heatmaps for pass/run tendencies.

**Game Detail** — EPA breakdown cards for both teams, a win probability chart that traces the flow of the game play-by-play, drive summaries in an accordion layout, and the five highest-leverage plays highlighted as cards.

**Team Comparison** — Side-by-side stat cards and bar charts for any two teams, plus head-to-head results for the selected season.

## The Real Challenge: Scope Control

Most of the technical problems in this project were straightforward to solve. The genuinely hard part was deciding what *not* to build.

NFL analytics is a rabbit hole. You could add situational splits by quarter, red zone target shares, pressure rate adjustments, receiver separation metrics, personnel grouping analysis — the list is effectively infinite. Each feature sounds reasonable in isolation, but the compound effect is a product that never ships.

I addressed this by writing exhaustive planning documents before writing a line of application code. A constraints document established hard rules: the database schema is authoritative, API response shapes are locked to a contract, all queries live in a single file, no backend caching. A project plan defined explicit phases with concrete deliverables. A feature expansion document tracked what was in scope, what was deferred, and why.

This planning infrastructure turned out to be the most valuable part of the project. Not because any individual constraint was profound, but because having them written down eliminated decision fatigue during implementation. When I was deep in building the player stats pipeline and thought "I should also add target share percentages," I could check the plan, confirm it wasn't in scope, and move on. That discipline is what kept a two-week focused development sprint from ballooning into two months.

## Development Timeline

I built a bare-bones MVP a couple of months before the main development push — just enough to prove the data pipeline worked and render a basic league view. Then the project sat idle for a while. When I picked it back up, I committed to roughly two weeks of focused development that took it from prototype to finished product.

The work progressed through defined phases: foundation (logging, health checks, test infrastructure), mobile responsiveness (collapsible sidebar, responsive grids), expanded player roles (the CTE union pattern for multi-position aggregation), UI/UX polish (skeleton loading states, accessibility attributes, per-page metadata), and DevOps (ETag caching, timing middleware, GitHub Actions for keep-alive pings and weekly data refreshes).

The whole process was notably smooth. No marathon debugging sessions, no moments of wanting to throw the laptop. That's not because the project was trivial — it's because the upfront planning eliminated most of the ambiguity that usually causes friction. When you know exactly what table a query should hit, what shape the API response should be, and where the file should live before you start typing, implementation becomes mechanical in the best sense.

## Technical Highlights

A few implementation details I'm particularly satisfied with:

**Player aggregation via CTE unions.** Rather than treating players as single-role, the transform layer runs three parallel CTEs — passer, rusher, and receiver — against the plays table, unions them, and groups by player. A dual-threat quarterback gets both passing and rushing stats populated. The frontend then renders position-appropriate columns based on the player's position group.

**ETag middleware for client caching.** Instead of server-side caching (which the constraints doc explicitly prohibits), the backend computes an MD5 hash of each JSON response body and returns it as an ETag header. On subsequent requests with `If-None-Match`, the server returns a 304 with no body. This keeps the backend stateless while still avoiding redundant data transfer.

**Team logos as scatter plot data points.** Recharts doesn't natively support image markers, so the scatter plot uses a custom `shape` render function that places SVG `<image>` elements at each data point's coordinates. The result is an immediately recognizable visualization — you can spot where your team sits at a glance without reading a legend.

**Keep-alive workflow.** Render's free tier spins down after inactivity, and Neon suspends idle compute. A GitHub Actions cron job pings the `/health` endpoint (which runs a `SELECT 1` against the database) every four minutes, keeping both services warm and ensuring the app loads quickly for visitors.

## Deployment

The app is live at [crud.russellbomer.com](https://crud.russellbomer.com). The frontend deploys automatically from the main branch via Vercel. The backend runs on Render with the database hosted on Neon's serverless PostgreSQL. Data refreshes run weekly on Wednesdays via GitHub Actions, timed to when the NFL finalizes stat corrections from the previous week's games.

## Reflection

If I were starting over, I wouldn't change much. The systematic approach — plan first, constrain the scope, then execute — produced exactly the outcome I wanted. The thing I'm most proud of isn't any single feature or clever query. It's the cohesive vision and the planning that made the development process smooth from start to finish. That's not visible to anyone visiting the site, but it's the skill that matters most in professional software development: the ability to define a clear scope, make deliberate architectural decisions, and ship a complete product without getting lost in the weeds.

The project exercised architecture design and scope control more than any raw debugging ability — and honestly, those are harder muscles to build.
