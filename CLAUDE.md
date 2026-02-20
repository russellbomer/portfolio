# Claude Code Instructions (binding)

## Project

This is a Next.js portfolio site deployed on Vercel.

- App code lives in `apps/portfolio/`.
- Root workspace: `npm run dev`, `npm run build`, `npm run lint`.

## Execution rules

- Do NOT run commands without asking for approval. When asking, include the exact command(s) and why.
- Do not commit secrets or `.env*` files (only `.env*.example`).

## Hard stops (must be manual)

- Any credentials/secrets/keys/token rotation or handling
- Vercel/GitHub settings changes
- DNS changes
- Any destructive git ops: history rewrite or force push

---

## Architecture overview

### Stack

- **Next.js 15** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind v4** (CSS-first config via `@theme` in `globals.css`)
- **Framer Motion v12** — all animation primitives
- **Drizzle ORM + Postgres** — contact form / connect page persistence
- **shadcn/ui** conventions — `components.json` present, Radix UI primitives

### App routes (`apps/portfolio/app/`)

| Route | Notes |
|---|---|
| `/` | Entry point — animated loading screen + typewriter hero |
| `/home` | Static clone of `/` — no typewriter/loading; used for "back" navigation |
| `/work` | Projects/case studies |
| `/connect` | Contact form (DB-backed) |
| `/standards` | Philosophy and working style |
| `/writing` | Writing index |
| `/tmi` | Extended bio |
| `/demos` | Demos |
| `/_archive` | Archived/hidden pages |

`/` and `/home` are intentionally near-identical. `/` is the public entry point — it runs the loading screen, scroll lock, and typewriter intro on first visit (gated by `InitialLoadProvider`). `/home` is the internal "back to home" target linked from all subdirectory pages; it skips the intro entirely (`StaticHeroContent`, no scroll lock) so visitors don't sit through the animation again when navigating back.

### Component map (`apps/portfolio/components/`)

#### `motion/` — animation primitives

- **`ScrollSection`** — Core building block. On desktop: an invisible scroll-spacer div (`h-[200vh]` for first/last, `h-[400vh]` for middle) paired with a `position:fixed` content overlay. Scroll progress drives opacity via `useScroll` + `useSpring`. First section also translates upward (parallax). On mobile: natural layout with `whileInView` fade-in.
- **`ScrollLinkedAbout`** — Like `ScrollSection` but with `h-[420vh]` spacer and inner content that itself scrolls (text box whose `y` is driven by scroll progress 0.5→0.74).
- **`RouteScrollSpring`** — Root layout wrapper. Skips animation on `/` and `/home`. On all other routes: `initial={{ opacity:0, y:8 }}` entry + subtle exit spring at page bottom.
- **`ScrollProgressRail`** — Fixed vertical progress bar (left edge, desktop only). Anchors map to section center-scroll positions; spring-smoothed fill.
- **`SectionCenterNudge`** — RAF-based scroll snapping. Detects slow scrolls near section boundaries and nudges to the section center target. Custom thresholds for hero→about (0.68) and about→standards (0.93). Suppressed during sidebar nav clicks via `section-navigation-scroll-start` custom event.
- **`TypewriterText`** — Character-by-character text reveal with cursor blink. Supports `delay`, `speed`, `ellipsisSpeed`, and `onComplete` callback.
- **`AnimatedSection`, `FadeIn`, `StaggerContainer`** — General-purpose Framer Motion wrappers.

#### `sections/` — page content

- **`HeroContent`** — Three-line typewriter sequence gated by `shouldAnimate` from `InitialLoadProvider`. Calculates scroll target to the point where the sidebar becomes visible.
- **`StaticHeroContent`** — Same layout but instant, used on `/home`.
- **`ScrollLinkedAbout`** — About section (also holds the `aboutContent` copy array).

#### `layout/` — chrome

- **`SidebarNav`** — Fixed left nav (desktop, `lg:block`). Appears when scrolled to the About section center. Tracks active section by viewport center proximity. Clicking a section scrolls to `elementTop + height * 0.5 - vh * 0.5` (the peak-opacity position). Uses `TypingLabel` sub-component for character-staggered labels.
- **`GlobalDecor`** — Mounts `PinwheelBackground`.
- **`Footer`** — Site footer.

#### `ui/` — primitives

- **`Pinwheel`** — SVG pinwheel (4 blades). Scroll-driven rotation via `useScroll` + `useTransform`. Supports `initialRotation` (for intro animation handoff), `alignScrollAnchors` (plumb alignment at section centers), and alternating `colors`.
- **`PinwheelBackground`** — Responsive pinwheel grid. `accent` mode (mobile): single pinwheel, top-right. `grid` mode (desktop): 1–2 column tiled strip along the right edge. Six breakpoints defined as `BREAKPOINTS` constants. Synced to intro animation timing constants (`INTRO_START = 3800ms`, `INTRO_END = 9960ms`).
- **`LoadingScreen`** — Blocks scroll during initial load; fades out before typewriter starts.
- **`CustomCursor`, `NoiseTexture`, `BackToTop`** — Decorative/UX helpers.

#### `providers/`

- **`InitialLoadProvider`** — Context that tracks whether the current browser session has already loaded the site. `shouldAnimate = true` only on the first visit (session-scoped). Controls typewriter and loading screen.

### Design system

**Fonts** (loaded via `next/font/google`):
- `--font-sans` → Inter (body)
- `--font-display` → Syne (headings; use `font-display` class)
- `--font-mono` → Courier Prime (monospace; default body font via `body` tag)

**Craftsman palette** (defined as CSS custom props in `globals.css`):

| Token | Light | Dark | Description |
|---|---|---|---|
| `--linen` | `hsl(44 48% 94%)` | — | Warm paper; light bg |
| `--thorn` | `hsl(107 18% 15%)` | — | Deep green-black; light text / dark bg |
| `--eucalyptus` | `hsl(144 14% 63%)` | same | Muted sage green accent |
| `--rust` / `--ferrum` | `hsl(22 76% 36%)` | same | Terracotta/orange |
| `--fern` | `hsl(118 19% 41%)` | same | Mid green |
| `--creamsicle` | `hsl(23 81% 63%)` | same | Warm orange highlight |

Use `hsl(var(--token))` directly in inline styles; or `bg-[hsl(var(--token))]` in Tailwind classes. Semantic tokens (`--background`, `--foreground`, `--primary`, etc.) are mapped from the above in both light and dark layers.

### Scroll system — how it works

On **desktop** (≥ 768px), the homepage is essentially a tall page where:

1. Each section creates a tall invisible spacer (`div`) that owns the scroll distance.
2. A `position: fixed` motion overlay renders the visible content, opacity-driven by the spacer's scroll progress.
3. `SectionCenterNudge` gently snaps the user to section "peak" positions (where opacity = 1) when scrolling slowly.
4. `SidebarNav` and `ScrollProgressRail` appear after the hero, tracking the same anchor positions.
5. `PinwheelBackground` pinwheels rotate from global scroll, with plumb correction at section anchors.

**Scroll height allocation:**
- Hero (`isFirst`): `h-[200vh]`
- About: `h-[420vh]` (extra for inner content scroll)
- Standards, Work: `h-[400vh]`
- Connect (`isLast`): `h-[200vh]`

**Spring config** (used everywhere): `{ stiffness: 100, damping: 30, restDelta: 0.001 }`

**Z-index layers:**
- `z-0` — PinwheelBackground
- `z-10` — ScrollSection fixed overlays
- `z-40` — ScrollProgressRail
- `z-50` — SidebarNav

### Intro animation timing (first load only)

All timed to milliseconds from page load:

| Event | Time |
|---|---|
| Loading screen visible | 0 – ~2500ms |
| Loading screen fade-out | ~2500 – ~3700ms |
| Typewriter line 1 ("Hello, I'm") | 3800ms |
| Typewriter line 2 ("Russell Bomer") | 4700ms |
| Typewriter line 3 (tagline) | 5850ms |
| Pinwheel intro rotation (0→360°) | 3800ms – 9960ms |

`INTRO_START` / `INTRO_END` constants in `PinwheelBackground.tsx` must stay in sync with the typewriter timing in `HeroContent.tsx`.

### Accessibility

- `prefers-reduced-motion`: all Framer Motion components check `useReducedMotion()`. When true, desktop scroll system degrades to natural scroll + `whileInView` fade-ins.
- Skip-to-main link in root layout.
- `PinwheelBackground` and `ScrollProgressRail` have `aria-hidden="true"`.
- `SidebarNav` uses `aria-label` and `aria-current`.
