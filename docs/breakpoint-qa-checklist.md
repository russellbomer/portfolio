# Breakpoint QA Checklist

Use this checklist while resizing in browser DevTools. Fill in **Pass/Fail** and notes for each width.

## Test Setup

- Date:
- Browser:
- OS:
- Tester:
- Route(s) tested:
  - `/`
  - `/home`
  - `/connect`
  - `/work`
  - `/writing`
- DevTools height used (recommended): `900`

---

## What to Verify at Each Width

- Sidebar nav visibility/placement (`hidden lg:flex` behavior)
- Scroll section behavior (mobile mode vs desktop mode around `768`)
- Hero/heading typography scaling (`md:` / `lg:` text sizes)
- Horizontal padding/layout shifts (`md:` / `lg:` spacing)
- Grid changes (cards/forms from 1-col to 2-col, etc.)
- Footer stacking/alignment/padding
- Pinwheel background mode/size/position changes
- Any clipping, overlap, horizontal scroll, or jumpy transitions

---

## Breakpoint Triplets

### 1) Mobile → sm (`639 / 640 / 641`)

#### 639x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 640x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 641x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

### 2) sm → md (critical JS + Tailwind cutoff: `767 / 768 / 769`)

#### 767x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 768x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 769x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

### 3) md → lg (sidebar appears: `1023 / 1024 / 1025`)

#### 1023x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 1024x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 1025x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

### 4) lg → xl (`1279 / 1280 / 1281`)

#### 1279x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 1280x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 1281x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

### 5) xl → 2xl (`1535 / 1536 / 1537`)

#### 1535x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 1536x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

#### 1537x900
- Pass/Fail:
- Sidebar:
- ScrollSection mode:
- Footer layout:
- Pinwheel:
- Issues found:
- Notes:

---

## Optional Real Device Presets (Quick Sanity)

### iPhone SE (`375x667`)
- Pass/Fail:
- Notes:

### iPhone 14 Pro (`393x852`)
- Pass/Fail:
- Notes:

### Pixel 7 (`412x915`)
- Pass/Fail:
- Notes:

### iPad Mini (`768x1024`)
- Pass/Fail:
- Notes:

### iPad Air (`820x1180`)
- Pass/Fail:
- Notes:

### Laptop 13" (`1280x800`)
- Pass/Fail:
- Notes:

### Desktop FHD (`1920x1080`)
- Pass/Fail:
- Notes:

---

## Summary

- Total tested:
- Total pass:
- Total fail:
- Highest-priority fixes:
  1.
  2.
  3.

## Paste-Back Format (for implementation)

When you send results back, use this format for each issue:

- Width: 
- Route: 
- Component/area: 
- Expected: 
- Actual: 
- Severity: (low / medium / high)
- Screenshot ref (optional): 
