# BFB Homepage Replica: Layout Analysis and Work Breakdown

## For Claude Code CLI implementation

---

## 1. Design Token Extraction (from Substack CSS variables)

### Colors

```
Accent/CTA (orange-red):  #ff3300
Accent hover/darken:      #e62e00
Accent 20% opacity:       rgba(255, 51, 0, 0.2)
Accent 30% opacity:       rgba(255, 51, 0, 0.3)
Print on accent:          #ffffff

Background (page):        #ffffff
Background contrast 1:    #f0f0f0
Background contrast 2:    #dddddd
Background contrast 3:    #b7b7b7
Background contrast 4:    #929292
Background contrast 5:    #515151
Background elevated:      #ffffff
Background elevated sec:  #f0f0f0

Text primary:             #363737
Text secondary:           #757575  (used for meta, dates, author names)
Text tertiary:            #b6b6b6
Border/detail:            #e6e6e6

Cover background:         #FFFFFF
Cover background sec:     #f0f0f0
Cover border:             #ff3300
```

### Typography

```
Headings font:    'SF Pro Display', -apple-system, system-ui, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
Headings weight:  700
Body font:        Same stack as headings
Body weight:      400
Font preset:      sans (both heading and body)
```

Since SF Pro Display is Apple-only, the cross-platform fallback chain is effectively: system-ui > Inter > Segoe UI > Roboto. Using Inter as the primary web font is the correct approach for your Next.js build (already in your portfolio stack).

### Border Radius

```
Post preview cards:  var(--border-radius-xs) (from inline style on #main)
Visible in screenshot: ~4px on post thumbnail corners, slight rounding
```

---

## 2. Layout Map (Top to Bottom)

### A. Top Bar (Fixed, 87px height)

```
+--------------------------------------------------------------+
| [B icon]    [BROWNS FILM BREAKDOWN logo]    [🔍 💬 🔔] [Upgrade to founding] [Avatar] |
+--------------------------------------------------------------+
```

- Height: 87px (from inline style)
- Background: white (#ffffff)
- Three-column flex layout:
  - Left: Logo icon (40x40 rounded square, white bg, the orange "B" icon)
  - Center: Wordmark image (height: 36px, the "BROWNS FILM BREAKDOWN" text logo)
  - Right: Icon buttons (search, chat, bell) + orange CTA button + user avatar (40x40 circle)
- Padding: 20px left/right
- Gap: 12px between items
- The wordmark is an image: `https://substackcdn.com/image/fetch/.../81b163d6-a537-48c9-8e23-f7cdbc11942b_1119x256.png`
- The B icon: `https://substackcdn.com/image/fetch/.../22f7cb63-2ac2-4337-83ba-bcf37d13c9ec_256x256.png`

### B. Section Nav Bar (Fixed, 48px height, below top bar)

```
+--------------------------------------------------------------+
|   Home | Podcast | Film | News | Chat | Shop | Leaderboard | About   |
+--------------------------------------------------------------+
```

- Height: 48px
- Border top and bottom: detail color (#e6e6e6)
- Horizontally centered flex, scrollable on small screens
- "Home" is the active/selected item (gets underline treatment)
- Links:
  - Home: /
  - Podcast: /s/podcast
  - Film: /s/film-room
  - News: /notes (opens in new tab)
  - Chat: substack chat URL (opens in new tab)
  - Shop: external itemorder.com URL (opens in new tab)
  - Leaderboard: /leaderboard
  - About: /about
- Font: meta/uppercase style, 11px, medium weight
- Spacer div below nav: 138px (this is the combined height placeholder for both fixed bars: 87 + 48 + padding = ~138px)

### C. Hero Section ("magazine-5" layout)

```
+-------------------+-------------------------+-------------------+
| Post card (small) |                         | Post card (small) |
|  - thumbnail      |    Featured post        |  - thumbnail      |
|  - title          |    (large center)       |  - title          |
|  - excerpt        |    - large thumbnail    |  - excerpt        |
|  - meta           |    - title              |  - meta           |
+-------------------+    - excerpt            +-------------------+
| Post card (small) |    - meta/author        | Post card (small) |
|  - thumbnail      |                         |  - thumbnail      |
|  - title          |                         |  - title          |
|  - excerpt        |                         |  - excerpt        |
|  - meta           |                         |  - meta           |
+-------------------+-------------------------+-------------------+
```

- CSS variable `--home_hero: magazine-5` identifies this layout preset
- 3-column grid: left col, center (large featured), right col
- Center column is approximately 2x the width of side columns
- Each card has:
  - Thumbnail with aspect-ratio ~1.5 (3:2), border-radius xs
  - Content type badges overlaid on thumbnail (e.g., "PODCAST", "NEWSLETTER")
  - Video duration badge overlaid bottom-left (e.g., "51:48")
  - "RECOGNIZE GAME" watermark visible on some thumbnails (BFB's branding on video)
  - Title: bold, ~16px for small cards, larger for center
  - Excerpt: secondary text color, truncated
  - Meta line: pin icon + lock icon (for subscriber content) + relative date + "•" + author name
  - Post interaction row (UPT): heart count, comment icon, repost icon, share icon
- Background: white
- Padding around the whole section

### D. Support Banner

```
+--------------------------------------------------------------+
| "We appreciate your support!"    [Upgrade to founding]       |
+--------------------------------------------------------------+
```

- Full width band
- Light gray background (background_contrast_1: #f0f0f0)
- Centered text + orange CTA button
- Simple flex row, centered

### E. Section: "2026 NFL Draft" (Content category section)

```
+--------------------------------------------------------------+
| 2026 NFL Draft                                    VIEW ALL   |
+--------------------------------------------------------------+
| [Card] [Card] [Card] [Card]                                 |
|  (4-column grid of post previews)                            |
+--------------------------------------------------------------+
```

- Section heading: bold, left-aligned, with "VIEW ALL" link right-aligned
- 4-column grid of post preview cards (same card format as hero small cards)
- Each card: thumbnail (3:2), title, excerpt (truncated), meta line, interaction icons
- Appears to be a curated/tagged section, not just chronological

### F. Footer Area (3-column layout)

```
+------------------+------------------------+-------------------+
| BFB Info         | Recent posts           | Recommendations   |
|  - Logo          |  - Post list           |  - Daft on Draft  |
|  - Tagline       |  (title + excerpt +    |  - MatchQuarters  |
|  - [Subscribed]  |   thumbnail + meta)    |  - Bill and Doug  |
|                  |  - "See all" link      |  - Buckeye Film   |
| Social           |                        |    Breakdown      |
|  - Twitter       |                        |                   |
|  - Instagram     |                        |                   |
|  - YouTube       |                        |                   |
|  - TikTok        |                        |                   |
|  - Facebook      |                        |                   |
+------------------+------------------------+-------------------+
```

- 3-column layout at desktop
- Left column: publication info (logo, tagline, subscription status, social links)
- Center column: "Recent posts" with search icon and "VIEW ALL" link. Post list format: title + excerpt on left, thumbnail on right, meta below. 3 posts visible + "See all" link
- Right column: "Recommendations" of other Substack publications (logo + name + author for each)

### G. Bottom Footer

```
+--------------------------------------------------------------+
| © 2026 Browns Film Breakdown · Privacy · Terms · Collection  |
|            [Start your Substack]  [Get the app]              |
|         Substack is the home for great culture               |
+--------------------------------------------------------------+
```

- Centered, light text
- Substack branding (this would be removed in the BFB platform replica)

---

## 3. Post Card Anatomy (Reusable Component)

Every post card in every section uses the same basic structure with size variants:

```
+----------------------------------+
| [Thumbnail image]                |
|   [Content type badge]  top-left |
|   [Duration badge]   bottom-left |
|   [Paywall lock icon] if subscriber-only |
+----------------------------------+
| Title (bold, 1-2 lines)          |
| Excerpt (muted, 1-2 lines,      |
|   truncated with ellipsis)       |
| [pin] [lock] DATE • AUTHOR      |
| [♡ n] [💬 n] [↻] [↗]           |
+----------------------------------+
```

Variants:
- **Small** (hero side columns, section grids): ~25% width, compact text
- **Large/Featured** (hero center): ~50% width, larger text, more excerpt visible
- **List item** (recent posts footer): horizontal layout, text left + thumbnail right

---

## 4. Work Breakdown Structure

### Phase 0: Route and Theme Setup

- [ ] Create route at `app/demos/bfb/`
- [ ] Create BFB layout using a route group with its own root layout, bypassing the portfolio's root layout entirely
  - Create a route group (e.g., `app/(bfb)/demos/bfb/layout.tsx`) with a standalone root layout that does not include portfolio chrome (LoadingScreen, GlobalDecor, SidebarNav, LockPortrait, RouteScrollSpring, InitialLoadProvider)
  - This layout sets its own `<html>` and `<body>` tags with BFB-specific styling, including resetting `html { font-size: 16px }` (the portfolio root uses 22px, which will break all rem-based sizing)
  - The BFB layout must not inherit the portfolio's `dark` class, Craftsman Palette variables, or font assignments
- [ ] Define BFB CSS variables matching the extracted tokens above
- [ ] Set up Inter as the font (already in portfolio, just needs correct variable references)
- [ ] Verify the page renders at `/demos/bfb` with BFB colors and no portfolio chrome

### Phase 1: Header and Navigation

- [ ] Build top bar component (87px height, fixed position)
  - Left: BFB "B" icon (download from Substack CDN or recreate)
  - Center: BFB wordmark (download from Substack CDN or recreate as text)
  - Right: Search, chat, bell icon buttons + "Upgrade to founding" CTA + avatar placeholder
- [ ] Build section nav bar (48px, fixed below top bar)
  - Horizontal scrollable nav with items: Home, Podcast, Film, News, Chat, Shop, Leaderboard, About
  - Active state for Home (underline or bold treatment)
  - Border top/bottom: #e6e6e6
- [ ] Add spacer below fixed headers (138px)
- [ ] Verify header is visually identical to screenshot at desktop width

### Phase 2: Post Card Component

- [ ] Build reusable PostCard component with variants (small, featured, list)
- [ ] Thumbnail with overlay badges:
  - Content type badge (top-left): "PODCAST", "NEWSLETTER", etc.
  - Duration badge (bottom-left): "51:48", "27:56", etc.
  - "RECOGNIZE GAME" watermark (this appears to be on BFB's actual video thumbnails, part of the image itself, not a CSS overlay)
- [ ] Post metadata line: icons (pin, lock) + relative date + "•" + author name
- [ ] Interaction row: heart + count, comment icon + count, repost, share
- [ ] Text truncation with line-clamp
- [ ] Ensure card border-radius matches Substack's xs value (~4px)

### Phase 3: Hero Section (Magazine-5 Layout)

- [ ] Implement 3-column grid matching the magazine-5 hero layout
  - Left column: 2 stacked small cards
  - Center column: 1 large featured card
  - Right column: 2 stacked small cards
- [ ] Responsive behavior: need to check what happens on tablet/mobile (likely collapses to single column)
- [ ] Populate with hardcoded BFB post data (use real titles/excerpts from the screenshot)
- [ ] Download actual thumbnail images from BFB's Substack CDN for visual fidelity

### Phase 4: Support Banner

- [ ] Simple full-width band with gray background
- [ ] Centered text + orange CTA button
- [ ] Minimal component, should take 15 minutes

### Phase 5: Content Section ("2026 NFL Draft")

- [ ] Section header with title left, "VIEW ALL" link right
- [ ] 4-column grid of PostCard (small variant)
- [ ] Populate with hardcoded draft-related post data

### Phase 6: Footer Area

- [ ] 3-column layout
- [ ] Left: BFB info block (logo, tagline, subscription badge, social links list)
- [ ] Center: "Recent posts" with horizontal post list items (title/excerpt left, thumbnail right)
- [ ] Right: "Recommendations" with publication logos and names
- [ ] "See all" link at bottom of recent posts
- [ ] Bottom footer with copyright and links (replace Substack branding with BFB-specific)

### Phase 7: Polish and Verification

- [ ] Side-by-side comparison with the screenshot at matching viewport width
- [ ] Verify all colors match the extracted tokens
- [ ] Verify typography (font family, weights, sizes) matches
- [ ] Verify spacing/padding matches (may need pixel-level adjustments)
- [ ] Test at multiple viewport widths (desktop, tablet)
- [ ] Mobile responsive pass (not pixel-perfect replica, just functional)

### Phase 8: Deploy

- [ ] Commit to portfolio repo
- [ ] Push to Vercel
- [ ] Verify at russellbomer.com/demos/bfb
- [ ] Test the URL works and loads correctly before the call

---

## 5. Asset URLs (from Substack CDN)

Download these and host locally in `/public/images/bfb/`:

```
Logo icon (B):
https://substackcdn.com/image/fetch/w_256,h_256,c_fill,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F22f7cb63-2ac2-4337-83ba-bcf37d13c9ec_256x256.png

Wordmark:
https://substackcdn.com/image/fetch/h_72,c_limit,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F81b163d6-a537-48c9-8e23-f7cdbc11942b_1119x256.png

Favicon:
https://substackcdn.com/image/fetch/f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1f46b527-e7b6-4f30-a5ce-5ad9623bb2e8%2Ffavicon-32x32.png
```

For post thumbnails, either download from the actual posts or use placeholder images that match the aspect ratio (3:2) and general feel (football action shots, players, field).

---

## 6. Notes for Claude Code Session

- The root layout at `app/layout.tsx` wraps everything in portfolio-specific providers (InitialLoadProvider, LoadingScreen, GlobalDecor, LockPortrait, RouteScrollSpring). The BFB demo uses a route group with its own root layout to bypass all of these entirely.
- Tailwind v4 is in use with `@theme` directives and CSS variable-based color system. BFB colors should be defined as CSS variables and referenced via arbitrary Tailwind values `[var(--bfb-xxx)]` or inline styles.
- The portfolio uses `html { font-size: 22px }` as a base. The BFB demo needs to reset this to 16px within its layout, or all sizing will be wrong.
- Substack uses Lucide icons throughout. The portfolio already has `lucide-react` installed.
- The `--home_hero: magazine-5` CSS variable indicates this is a Substack preset layout. You're replicating the visual result, not the Substack layout engine.
- Post interaction icons (heart, comment, repost, share) are all Lucide SVGs.

---

*Prepared for Claude Code CLI implementation session.*
