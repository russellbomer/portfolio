# CLAUDE.md — Portfolio Site

## Current Task: BFB Homepage Mockup

All work in this session is scoped to building a visual replica of the Browns Film Breakdown Substack homepage as a route within this portfolio site. See `app/demos/bfb/BFB_HOMEPAGE_WBS.md` for the full layout analysis, design tokens, and phased work breakdown. Read that file before writing any code.

---

## Project: BFB Homepage Replica

### What This Is

A high-fidelity interactive replica of https://www.brownsfilmbreakdown.com, built at the route `/demos/bfb`. The purpose is a proof-of-concept to show the BFB team on a discovery call. The goal is pixel-level visual fidelity at desktop width.

### Route Group (Non-Negotiable)

The BFB page must use a route group with its own root layout to completely bypass this portfolio site's root layout. The portfolio root layout applies dark mode, a 22px base font size, Craftsman Palette color variables, and provider components (InitialLoadProvider, LoadingScreen, GlobalDecor, LockPortrait, RouteScrollSpring, SidebarNav) that will break the BFB replica.

Create the structure as `app/(bfb)/demos/bfb/layout.tsx` with a standalone root layout that:

- Renders its own `<html>` and `<body>` tags
- Does NOT inherit the portfolio's `dark` class, Craftsman Palette, or providers
- Sets `html { font-size: 16px }` (the portfolio uses 22px)
- Defines BFB color variables extracted from their Substack CSS
- Loads Inter as the primary font

Delete the existing files at `app/demos/bfb/` (page.tsx, layout.tsx, data.ts, README.md) from a prior attempt. They are not usable. Keep the CLAUDE.md and BFB_HOMEPAGE_WBS.md files.

### Design Tokens

Extracted from BFB's actual Substack CSS. Use these exact values.

#### Colors

```
--bfb-accent: #ff3300            /* Orange-red. CTAs, active nav, borders */
--bfb-accent-dark: #e62e00       /* Hover/pressed state */
--bfb-accent-20: rgba(255, 51, 0, 0.2)
--bfb-bg: #ffffff                /* Page background */
--bfb-bg-contrast-1: #f0f0f0    /* Light gray sections */
--bfb-bg-contrast-2: #dddddd
--bfb-bg-elevated: #ffffff       /* Card backgrounds */
--bfb-text-primary: #363737      /* Headings, titles */
--bfb-text-secondary: #757575    /* Meta text, dates, authors */
--bfb-text-tertiary: #b6b6b6    /* Lowest contrast */
--bfb-border: #e6e6e6            /* Borders, dividers */
--bfb-print-on-accent: #ffffff   /* Text on accent backgrounds */
```

#### Typography

```
Font: Inter (SF Pro Display in Substack's stack, falls through to Inter on non-Apple)
Headings weight: 700
Body weight: 400
Base size: 16px
Meta text: 11px, uppercase, medium weight
```

#### Key Dimensions

```
Top bar: 87px height, 20px horizontal padding, 12px gap
Section nav: 48px height
Fixed header spacer: 138px
Logo icon: 40x40px
Wordmark: 36px height
Avatar: 40x40px circle
Thumbnails: 3:2 aspect ratio
Card border-radius: ~4px
Nav icons: 20x20px
Post interaction icons: 14x14px
```

### Layout (Top to Bottom)

1. **Top bar** (fixed) — B icon left, wordmark center, search/chat/bell + orange CTA + avatar right
2. **Section nav** (fixed below top bar) — Home, Podcast, Film, News, Chat, Shop, Leaderboard, About
3. **Hero** ("magazine-5") — 3-column grid: 2 small stacked cards | 1 large featured card | 2 small stacked cards
4. **Support banner** — Gray band, "We appreciate your support!" + CTA
5. **Content section** — "2026 NFL Draft" heading + 4-column card grid
6. **Footer area** — 3 columns: BFB info + social, Recent Posts list, Recommendations
7. **Bottom footer** — Copyright, links

### Build Order

1. Route group and layout (blank white page at `/demos/bfb`, no portfolio chrome)
2. Header and navigation
3. PostCard component (small, featured, list variants)
4. Hero section
5. Support banner
6. Content section
7. Footer
8. Polish pass against screenshot

### Content and Links

All content is real, pulled directly from the live BFB site:

- **Post thumbnails**: Use actual BFB thumbnail image URLs from the Substack CDN — the images each post currently displays on brownsfilmbreakdown.com.
- **Text fields**: Use the actual title, excerpt, date, and author exactly as displayed on the live page.
- **Links**: All navigable items (nav bar, post cards, CTA buttons, footer links, social icons) link to their actual corresponding pages on brownsfilmbreakdown.com or the relevant external URL. Use `target="_blank" rel="noopener noreferrer"` on all outbound links.

### Interactivity

All components are interactive to some extent, even if not fully functional:

- **Search icon**: Opens a modal overlay matching Substack's search UI. Contains a text input, a "People" section (Jake Burns, Cody Suek, and any other BFB contributors), and a "Posts" section listing the most recent posts. The modal is visible and browseable but not wired to live search. A small italic note inside the modal reads: *"Search is not functional in this preview."*
- **Nav items**: Real anchor links to their BFB URL equivalents.
- **CTA buttons** ("Upgrade to founding", "Subscribe"): Link to the BFB subscribe page.
- **Post cards**: Entire card is a link to the actual post URL on brownsfilmbreakdown.com.
- **Footer social icons**: Link to BFB's actual social profiles.
- **Recommendation cards**: Link to the respective Substack publication.
- **All other non-linkable interactive elements** (e.g., bell icon, chat icon, avatar): Render a contextually appropriate visible-but-not-functional state — a tooltip, a placeholder dropdown, or a "not available in preview" indicator — rather than doing nothing on click.

### What NOT To Do

- Do not use portfolio Craftsman Palette colors, Syne/Courier Prime fonts, or dark mode.
- Do not add creative improvements beyond what's on the real site.
- Do not import Substack CSS. Build from scratch with Tailwind + extracted tokens.
- Do not install new dependencies. Existing stack covers everything.
- Do not prioritize mobile. Desktop fidelity first.

### Reference Files

- `app/demos/bfb/BFB_HOMEPAGE_WBS.md` — Complete layout analysis, DOM mapping, asset URLs, phased WBS
- Full-page screenshot of BFB homepage for visual comparison
- `app/demos/bfb/BFB_CSS.txt` — Raw HTML source of BFB Substack (if available)

### Existing Stack

- Next.js 15.5.9 (App Router, TypeScript)
- Tailwind CSS 4.1.7
- React 19.1.0
- lucide-react (already installed)
- Inter font (already loaded)
- Deployed on Vercel
