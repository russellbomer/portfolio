# CLAUDE.md — BFB Homepage Replica

## Project Overview

This is a visual replica of the Browns Film Breakdown (BFB) Substack homepage, built as a route within the existing portfolio site at russellbomer.com. The purpose is to demonstrate to the BFB team what their content looks like on a dedicated platform. This page will be shown on a discovery call as a proof-of-concept.

BFB is a Cleveland Browns film analysis publication currently on Substack (brownsfilmbreakdown.com). The broader project is building a full platform to replace Substack, but this immediate task is narrower: replicate the visual appearance of their current Substack homepage as closely as possible using the portfolio site's existing Next.js/Tailwind stack.

## What We're Building

A single page at `/demos/bfb` that is a near-identical visual replica of https://www.brownsfilmbreakdown.com as it appears to a logged-in subscriber at desktop width. The page uses hardcoded content (real BFB post titles, excerpts, thumbnails) and is not connected to any backend. Nothing is interactive beyond basic hover states. This is a static visual mockup.

## Key Reference Files

- `app/(bfb)/demos/bfb/BFB_HOMEPAGE_WBS.md` — Full layout analysis with CSS token extraction, section-by-section DOM mapping, asset URLs, and phased work breakdown. **Read this first.** It contains the exact colors, fonts, spacing values, layout structure, and component anatomy extracted from the actual BFB Substack site.
- The full-page screenshot of the actual BFB homepage for visual comparison should be placed in the project for reference.

## Critical Technical Decisions

### Route Group (Non-Negotiable)

The BFB demo page must use a **route group with its own root layout** to completely bypass the portfolio site's root layout. The portfolio root layout applies dark mode, a 22px base font size, Craftsman Palette color variables, and several provider components (InitialLoadProvider, LoadingScreen, GlobalDecor, LockPortrait, RouteScrollSpring, SidebarNav) that will break the BFB replica.

Create the route structure as: `app/(bfb)/demos/bfb/layout.tsx` with a standalone root layout that renders its own `<html>` and `<body>` tags. This layout must:

- NOT inherit the portfolio's `dark` class
- NOT include any portfolio provider components
- Set `html { font-size: 16px }` (Substack's default; the portfolio uses 22px)
- Define BFB-specific CSS variables (see Design Tokens below)
- Load Inter as the primary font (already available in the project)

Delete or ignore any files at `app/demos/bfb/` from a prior attempt (page.tsx, layout.tsx, data.ts). They are not usable.

### Static Content Only

Everything is hardcoded. No API calls, no database, no dynamic content. Post titles, excerpts, author names, dates, and thumbnail URLs are all defined in a data file or inline. Use real BFB content visible in the screenshot and on their Substack site.

### Visual Fidelity Over Functionality

The goal is pixel-level visual fidelity at desktop width (~1200-1400px). Hover states and cursor changes are fine. Nothing needs to navigate anywhere. Links can be `href="#"` or no-ops. The subscriber CTA button, search, nav links — all visual only.

Mobile responsiveness is secondary. It should not break on mobile but does not need to match Substack's mobile layout precisely.

## Design Tokens

Extracted from BFB's Substack CSS variables. Use these exact values.

### Colors

```
--bfb-accent: #ff3300            /* Orange-red. CTAs, active nav, borders */
--bfb-accent-dark: #e62e00       /* Hover/pressed state for accent */
--bfb-accent-20: rgba(255, 51, 0, 0.2)
--bfb-bg: #ffffff                /* Page background */
--bfb-bg-contrast-1: #f0f0f0    /* Light gray sections (support banner, footer) */
--bfb-bg-contrast-2: #dddddd
--bfb-bg-elevated: #ffffff       /* Card backgrounds */
--bfb-text-primary: #363737      /* Headings, post titles */
--bfb-text-secondary: #757575    /* Meta text, dates, author names */
--bfb-text-tertiary: #b6b6b6    /* Lowest contrast text */
--bfb-border: #e6e6e6            /* Borders, dividers, nav bar lines */
--bfb-print-on-accent: #ffffff   /* Text on accent-colored backgrounds */
```

### Typography

```
Font family (both headings and body):
  'SF Pro Display', -apple-system, system-ui, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif

Headings weight: 700
Body weight: 400
```

In practice, use Inter as the web font (SF Pro Display is Apple-only and will fall through to Inter on non-Apple devices). Inter is already installed in the portfolio project.

### Sizing and Spacing

- Top bar height: 87px
- Section nav bar height: 48px
- Fixed header spacer: 138px
- Top bar horizontal padding: 20px
- Logo icon: 40x40px, slight border-radius
- Wordmark image height: 36px
- User avatar: 40x40px, full border-radius (circle)
- Post thumbnail aspect ratio: 3:2 (1.5)
- Post card border-radius: ~4px (Substack's --border-radius-xs)
- Icon sizes in nav: 20x20px (Lucide icons)
- Icon sizes in post interactions: 14x14px
- Meta text: 11px, uppercase, medium weight

## Layout Structure (Top to Bottom)

See `BFB_HOMEPAGE_WBS.md` for the full diagrammed layout. Summary:

1. **Top bar** — Fixed. Logo icon left, wordmark center, action buttons + CTA + avatar right.
2. **Section nav** — Fixed below top bar. Horizontal tabs: Home, Podcast, Film, News, Chat, Shop, Leaderboard, About. "Home" is active.
3. **Hero section** — "Magazine-5" layout. 3-column grid: two small stacked cards on left, one large featured card in center, two small stacked cards on right.
4. **Support banner** — Full-width gray band. "We appreciate your support!" + orange CTA.
5. **Content section** — "2026 NFL Draft" heading + 4-column grid of post cards.
6. **Footer area** — 3-column layout: BFB info + social links, Recent Posts list, Recommendations.
7. **Bottom footer** — Copyright, links, Substack branding (replace with BFB-specific text).

## Component Architecture

### PostCard (reusable, 3 variants)

- **Small** — Used in hero side columns and section grids. Vertical layout: thumbnail on top, title, excerpt (truncated), meta line, interaction icons.
- **Featured** — Used in hero center. Same structure, larger sizing, more excerpt visible.
- **ListItem** — Used in footer "Recent posts." Horizontal layout: text content on left, thumbnail on right.

All variants share:
- Thumbnail with content type badge overlay (top-left: "PODCAST", "NEWSLETTER", etc.)
- Duration badge overlay (bottom-left, for video content)
- Lock icon for subscriber-only content
- Meta line: relative date + "•" + author name
- Interaction row: heart + count, comment + count, repost, share (all Lucide icons at 14px)

### Assets

Download these from Substack CDN and save to `public/images/bfb/`:

- Logo icon (the "B"): 256x256, the orange "B" on white background
- Wordmark: the "BROWNS FILM BREAKDOWN" text with small icon, height 36px rendered

URLs are in the WBS document. For post thumbnails, use actual BFB thumbnail URLs from their Substack CDN (hotlink for the demo; these are publicly accessible images).

## Icons

Substack uses Lucide icons throughout. The portfolio project already has `lucide-react` installed. Relevant icons:

- Search, MessageCircle, Bell (nav bar)
- Heart, MessageCircle, Share (post interactions)
- Pin, Lock (post meta)
- ChevronLeft, ChevronRight (nav scroll buttons)

## What NOT To Do

- Do not use the portfolio's Craftsman Palette colors, Syne/Courier Prime fonts, or dark mode.
- Do not make anything functional. No routing, no API calls, no search, no real navigation.
- Do not add custom creative touches or "improvements" to the layout. The goal is replication, not redesign. Match the screenshot.
- Do not use Substack's actual CSS class names or try to import their stylesheets. Build the layout from scratch using Tailwind utilities and the extracted design tokens.
- Do not install new dependencies unless absolutely necessary. The existing stack (Next.js 15, Tailwind v4, React 19, lucide-react, Inter font) covers everything needed.
- Do not spend time on mobile responsive layout. Desktop fidelity is the priority.

## Build Order

Follow the phased WBS in `BFB_HOMEPAGE_WBS.md`. The order matters:

1. Route group and layout setup (get a blank white page rendering at `/demos/bfb` with no portfolio chrome)
2. Header and navigation (fixed top bar + section nav)
3. PostCard component (reusable, all three variants)
4. Hero section (magazine-5 grid populated with real BFB content)
5. Support banner
6. Content section (2026 NFL Draft grid)
7. Footer area (3-column layout)
8. Polish pass (side-by-side comparison with screenshot, pixel adjustments)

## Verification

After each phase, compare the rendered output against the screenshot at the same viewport width. The BFB Substack homepage uses a max-width container (visible in the screenshot at roughly 800-900px content width within a wider viewport). Match that container width.

The final test: if you showed this page to someone familiar with BFB's Substack, they should not immediately realize it is a different site.
