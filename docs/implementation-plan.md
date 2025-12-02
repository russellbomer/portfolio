# Visual Overhaul Implementation Plan

**Status:** Final
**Branch:** `feature/landing-page-v2`
**Created:** November 28, 2025
**Last Updated:** November 28, 2025

---

## 1. Context and Target State

**Project:** Complete visual and UX overhaul of portfolio website

### Target Outcome

1. **Aesthetic balance:** Rustic + sleek, organic + modern — synthesis of diverse interests (chef, woodworker, musician, gardener, developer) with clear focus on software/full-stack engineering
2. **Scrollable single-page landing:** Integrated sections (About, Practice, Work, Connect) with sticky sidebar navigation
3. **Scroll-triggered animations:** Subtle, intentional animations using Framer Motion (fade + slight translate)
4. **4-color palette:**
   - Warm paper (with SVG texture — explore options)
   - Deep saturated ink (text)
   - Eucalyptus (accent)
   - Rust orange (accent/logo TBD)
5. **Copy rewrite:** Craftsman philosophy + dry wit/humor + artsy sensibility + erudition/intellectualism
6. **Signature elements:** Animated SVG signature (deferred until asset ready); others TBD

### Non-Functional Goals

- Maintain accessibility (respect `prefers-reduced-motion`)
- Preserve SEO metadata structure
- Keep performance high (optimize font loading, lazy animations)
- Dark mode support (invert approach — dark paper, light ink, keep accents; requires experimentation)

### Key Constraints

- Must work with existing Next.js App Router architecture
- Keep shadcn/ui components but restyle them
- Maintain existing content loading patterns (static generation for projects)
- Prioritize free fonts (Google Fonts, Fontshare)

---

## 2. Information Architecture

### Route Structure

| Route      | Purpose                        | Notes                         |
| ---------- | ------------------------------ | ----------------------------- |
| `/`        | Scrollable landing page        | All main sections integrated  |
| `/work`    | Projects/portfolio (full list) | Renamed from `/projects`      |
| `/writing` | Blog/articles                  | "Coming soon" for now         |
| `/demos`   | Live demos/workshop            | Accessible via footer         |
| `/connect` | Contact form                   | Full page for form submission |
| `/tmi`     | Deep-dive about page           | NEW — extended bio/background |

### Landing Page Structure

```
├── Loading animation + welcome message + "scroll for more" CTA
├── Hero (name, tagline, animated signature placeholder)
├── #about (who you are, craftsman ethos)
├── #practice (skills, approach, what you do)
├── #work (featured projects + demo previews, link to /work)
├── #connect (call to action section)
└── Footer (visible only after full scroll)
```

### Navigation

**Sticky Sidebar Nav (visible throughout scroll):**

- `#about`
- `#practice`
- `#work`
- `#connect`
- Unobtrusive styling
- Hover animation: first letters with streaming/typing effect (TBD)

**Footer (visible after full scroll):**

- Social media links
- Writing link (subtly distinct from social links)
- Demos link
- Copyright

---

## 3. Design Specifications

### Color Palette (4 colors)

| Role       | Color       | HSL (approximate)      |
| ---------- | ----------- | ---------------------- |
| Background | Warm paper  | `44 48% 94%` (linen)   |
| Foreground | Deep ink    | `48 4% 22%` (kalamata) |
| Accent 1   | Eucalyptus  | `144 14% 63%`          |
| Accent 2   | Rust orange | `22 76% 36%` (ferrum)  |

**Texture:** Explore SVG patterns for paper texture during implementation

**Dark Mode:** Invert approach (dark paper, light ink, keep eucalyptus + rust) — requires experimentation

### Typography

**Stack to evaluate (prioritize free fonts):**

| Role             | Candidates                       | Notes                          |
| ---------------- | -------------------------------- | ------------------------------ |
| Display/Headings | Fraunces, Newsreader, or similar | Expressive variable serif      |
| Body             | Inter or similar                 | Clean, legible sans            |
| Mono             | Courier Prime                    | KEEP — user loves vintage feel |
| Accent           | Display italic sparingly         | —                              |

### Animation Style

- **Intensity:** Noticeable but restrained (fade + slight translate)
- **Scroll triggers:** Sections reveal on scroll
- **Respect:** `prefers-reduced-motion` media query
- **Loading:** Initial loading animation with welcome message

---

## 4. Phased Implementation Plan

### Phase 1 — Foundation & Animation Infrastructure

**Goal:** Install Framer Motion, create reusable motion components, evaluate and add display font.

**Scope:**

- Package installation
- Motion components
- Font evaluation and addition
- Motion variants

**Excluded:** Changes to existing page layouts or copy

**Tasks:**

1. **Install Framer Motion**

   - Command: `npm install framer-motion`
   - Files: `package.json`

2. **Evaluate and add display font**

   - Evaluate: Fraunces, Newsreader, or similar
   - Add to `next/font/google` imports
   - Create `--font-display` CSS variable
   - Add `.font-display` utility
   - Files: `app/layout.tsx`, `app/globals.css`

3. **Create motion components**

   - Create `components/motion/` folder
   - Files to create:
     - `components/motion/AnimatedSection.tsx` — scroll-triggered section reveal
     - `components/motion/FadeIn.tsx` — generic fade-in wrapper
     - `components/motion/StaggerContainer.tsx` — stagger children animations
     - `components/motion/Counter.tsx` — animated number (tentative, may not use)

4. **Create shared animation variants**

   - Define consistent timing, easing, animation patterns
   - Files: `lib/motion/variants.ts`

5. **Add motion tokens to CSS**
   - Define `--motion-duration-fast`, `--motion-duration-normal`, `--motion-ease`
   - Files: `app/globals.css`

**Validation:**

- Build succeeds
- Components render in isolation
- `prefers-reduced-motion` disables animations

---

### Phase 2 — Color Palette Implementation

**Goal:** Replace existing palette with 4-color craftsman palette.

**Scope:**

- New CSS variables (direct replacement, no feature flag)
- Light mode palette
- Dark mode variant (experimental)
- Paper texture exploration

**Tasks:**

1. **Replace palette variables**

   - Remove old complex palette
   - Implement 4-color system: paper, ink, eucalyptus, rust
   - Files: `app/globals.css`

2. **Explore paper texture**

   - Test SVG noise/grain overlay
   - Test paper fiber texture
   - Decide during implementation
   - Files: `app/globals.css`, potentially `public/` for SVG assets

3. **Implement dark mode variant**
   - Invert: dark paper, light ink
   - Keep eucalyptus + rust accents
   - Experimental — adjust as needed
   - Files: `app/globals.css`

**Validation:**

- Light mode renders correctly
- Dark mode functional (may need iteration)
- No color contrast issues

---

### Phase 3 — Landing Page Transformation

**Goal:** Create scrollable single-page landing with integrated sections and loading animation.

**Scope:**

- Complete rewrite of `app/page.tsx`
- New copy (craftsman philosophy, wit, intellectualism)
- Animation wrappers
- Loading animation

**Excluded:** Header/footer (Phase 4), secondary pages (Phase 5)

**Tasks:**

1. **Create loading/welcome animation**

   - Initial loading state
   - Welcome message
   - "Scroll for more" CTA
   - Files: `app/page.tsx`, potentially new component

2. **Implement Hero section**

   - Name display (new typography)
   - Tagline (iterate on copy)
   - Animated signature placeholder
   - Staggered entrance animation
   - Files: `app/page.tsx`

3. **Implement #about section**

   - Personal story bridging analog/digital
   - Craftsman ethos
   - AnimatedSection wrapper
   - Link to `/tmi` for more
   - Files: `app/page.tsx`

4. **Implement #practice section**

   - Skills and approach
   - What you do / how you work
   - AnimatedSection wrapper
   - Files: `app/page.tsx`

5. **Implement #work section**

   - Featured projects (2-3)
   - Demo previews integrated
   - Link to `/work` for full list
   - AnimatedSection wrapper
   - Files: `app/page.tsx`

6. **Implement #connect section**

   - Call to action
   - "Let's Build Something" heading
   - Link to `/connect` for form
   - Files: `app/page.tsx`

7. **Apply new color palette**
   - Use new CSS variables throughout
   - Files: `app/page.tsx`

**Validation:**

- Landing page renders with all sections
- Scroll navigation works
- Animations trigger correctly
- Responsive on mobile/tablet/desktop
- SEO metadata correct

---

### Phase 4 — Navigation & Footer

**Goal:** Replace header with sticky sidebar nav; create minimal footer.

**Scope:**

- Remove traditional header
- Create sticky sidebar navigation
- Redesign footer

**Tasks:**

1. **Create sticky sidebar nav**

   - Unobtrusive styling
   - Links to: `#about`, `#practice`, `#work`, `#connect`
   - Hover animation: first letters with streaming/typing effect (TBD)
   - Visible throughout scroll
   - Files: `components/layout/SidebarNav.tsx` (new), `app/layout.tsx`

2. **Remove/repurpose Header component**

   - May keep for secondary pages or remove entirely
   - Files: `components/layout/Header.tsx`, `app/layout.tsx`

3. **Redesign Footer**
   - Minimal: copyright + links
   - Social media links
   - Writing link (subtly distinct)
   - Demos link
   - Visible only after full scroll on landing page
   - Files: `components/layout/Footer.tsx`

**Validation:**

- Sidebar nav functions correctly
- Smooth scroll to sections
- Footer appears at bottom
- Mobile responsive

---

### Phase 5 — Secondary Pages

**Goal:** Update all secondary pages with consistent styling and route changes.

**Scope:**

- Route renames
- Consistent styling
- Animation wrappers
- New `/tmi` page

**Tasks:**

1. **Rename and update `/projects` → `/work`**

   - Update route
   - Page title: "Work" or "The Work"
   - Staggered card entrance animations
   - Files: `app/work/page.tsx` (rename), `components/projects/ProjectCard.tsx`

2. **Update `/connect`**

   - Header: "Let's Build Something"
   - Micro-copy refinements
   - Subtle form animations
   - Files: `app/connect/page.tsx`, `components/contact/ContactForm.tsx`

3. **Update `/writing` (formerly `/blog`)**

   - Route rename
   - Keep "Coming soon" message
   - Consistent styling
   - Files: `app/writing/page.tsx` (rename)

4. **Update `/demos`**

   - Consistent styling
   - AnimatedSection wrappers
   - Files: `app/demos/page.tsx`

5. **Create `/tmi` page**

   - Deep-dive about/bio
   - Extended background
   - NEW page
   - Files: `app/tmi/page.tsx`

6. **Set up `/about` redirect**

   - Redirect to `/#about` anchor
   - Files: `app/about/page.tsx` or Next.js redirect config

7. **Update 404 page**
   - "Lost?" message
   - Helpful redirect
   - Personality/wit
   - Files: `app/not-found.tsx`

**Validation:**

- All routes work correctly
- Redirects function
- Consistent styling across pages
- Animations work on all pages

---

### Phase 6 — Polish & Cleanup

**Goal:** Remove deprecated code, performance/accessibility audits, documentation.

**Scope:**

- Code cleanup
- Audits (MUST-HAVE before launch)
- Documentation

**Tasks:**

1. **Remove deprecated CSS**

   - Delete unused variables (`--cta-background`, `--metrics-background`, etc.)
   - Remove unused text-shadow utilities
   - Files: `app/globals.css`

2. **Loading skeleton animations** (nice-to-have)

   - For async content if time permits
   - Lower priority
   - Files: Various components

3. **Performance audit** (MUST-HAVE)

   - Test animation performance on throttled connection
   - Verify font loading (no layout shift)
   - Check Lighthouse scores
   - Document results

4. **Accessibility audit** (MUST-HAVE)

   - Verify `prefers-reduced-motion` works
   - Test keyboard navigation
   - Check color contrast ratios
   - Fix any issues found

5. **Documentation update**
   - Update this plan with completion status
   - Document new components
   - Files: `docs/`

**Validation:**

- No unused code remains
- Lighthouse scores maintained or improved
- Accessibility audit passes
- Documentation complete

---

## 5. Copy Guidelines

### Tone & Voice

- **Craftsman philosophy:** Thoughtful, intentional, quality-focused
- **Dry wit/humor:** Understated, clever, not forced
- **Artsy sensibility:** Appreciation for aesthetics and craft
- **Erudition/intellectualism:** Well-read, curious, substantive

### Tagline Direction

Current placeholder: "Software shaped by sawdust, music, and mise en place"
**Status:** Close but needs iteration — less generic, less "twee", more authentically personal

### Navigation Labels

| Context     | Label                 |
| ----------- | --------------------- |
| Nav anchor  | About                 |
| Nav anchor  | Practice              |
| Nav anchor  | Work                  |
| Nav anchor  | Connect               |
| CTA button  | Explore the Work      |
| CTA/heading | Let's Build Something |
| Footer link | Writing               |
| Footer link | Demos                 |

### 404 Page

- "Lost?"
- Helpful redirect to home
- Light personality

---

## 6. Deferred Items

| Item                    | Status       | Notes                                         |
| ----------------------- | ------------ | --------------------------------------------- |
| Animated SVG signature  | Deferred     | Implement when asset ready                    |
| Custom illustrations    | Deferred     | May self-create, wife, or commission          |
| Dark mode refinement    | Post-launch  | Basic implementation in Phase 2, refine later |
| Visual regression tests | Post-launch  | Set up Playwright later                       |
| Metrics/counter section | Removed      | May revisit later                             |
| Writing content         | Deferred     | "Coming soon" for now                         |
| Loading skeletons       | Nice-to-have | Lower priority                                |

---

## 7. Files Summary

### New Files to Create

| File                                     | Purpose                         |
| ---------------------------------------- | ------------------------------- |
| `components/motion/AnimatedSection.tsx`  | Scroll-triggered section reveal |
| `components/motion/FadeIn.tsx`           | Generic fade-in wrapper         |
| `components/motion/StaggerContainer.tsx` | Stagger children animations     |
| `components/motion/Counter.tsx`          | Animated number (tentative)     |
| `components/layout/SidebarNav.tsx`       | Sticky sidebar navigation       |
| `lib/motion/variants.ts`                 | Shared animation variants       |
| `app/tmi/page.tsx`                       | Deep-dive about page            |
| `app/work/page.tsx`                      | Renamed from projects           |
| `app/writing/page.tsx`                   | Renamed from blog               |

### Files to Modify

| File                                  | Changes                                    |
| ------------------------------------- | ------------------------------------------ |
| `app/layout.tsx`                      | New fonts, sidebar nav, layout restructure |
| `app/globals.css`                     | New palette, motion tokens, cleanup        |
| `app/page.tsx`                        | Complete rewrite — scrollable landing      |
| `components/layout/Footer.tsx`        | Minimal redesign                           |
| `components/layout/Header.tsx`        | Remove or repurpose                        |
| `app/connect/page.tsx`                | Copy and styling updates                   |
| `app/demos/page.tsx`                  | Styling updates                            |
| `app/not-found.tsx`                   | "Lost?" messaging                          |
| `components/projects/ProjectCard.tsx` | Animation additions                        |
| `components/contact/ContactForm.tsx`  | Micro-copy, animations                     |
| `package.json`                        | Add framer-motion                          |

### Files to Delete/Redirect

| File                 | Action                   |
| -------------------- | ------------------------ |
| `app/projects/`      | Rename to `app/work/`    |
| `app/blog/`          | Rename to `app/writing/` |
| `app/about/page.tsx` | Redirect to `/#about`    |

---

## 8. Implementation Checklist

| Phase | Key Deliverable                              | Priority |
| ----- | -------------------------------------------- | -------- |
| 1     | Animation infrastructure + motion components | High     |
| 2     | 4-color palette + texture exploration        | High     |
| 3     | Scrollable landing page with all sections    | High     |
| 4     | Sticky sidebar nav + minimal footer          | High     |
| 5     | Secondary pages + route renames              | Medium   |
| 6     | Cleanup + audits (perf/a11y MUST-HAVE)       | High     |

---

## 9. Branch Strategy

- **New branch:** `feature/landing-page-v2`
- **Base:** Create from `main`
- **Current branch preserved:** `feature/phase2-refactor` remains untouched
- **Approach:** Direct rewrite (no feature flags)
