# Theme System Overview

Concise reference for the portfolio theme architecture. For the full interactive editor see `/theme-lab` and its README.

## Core Concepts

- **Palette:** Array of base colors in `portfolio-theme-final.json`, each with an `id`, human name, and HSL triplet string formatted as `"H S% L%"` (no commas, degrees, or `hsl()` wrapper).
- **Schemes:** Separate `light` and `dark` objects map semantic roles (e.g. `background`, `foreground`, `primary`, `accent-foreground`) to a `baseColorId` (and optional `shadeKey` when a scale exists).
- **Semantic Roles:** Provide indirection so UI components never reference palette colors directly—enables global re‑themability and accessibility tuning.
- **Locked Colors:** Brand colors (`fern`, `ferrum`) marked with `"locked": true` to prevent accidental mutation; you can remove the flag in JSON for experimental rebranding.

## File: `portfolio-theme-final.json`

Minimal shape (omitting some roles for brevity):

```jsonc
{
  "name": "Portfolio Theme",
  "version": 1,
  "palette": [
    { "id": "linen", "hsl": "44 48% 94%" },
    { "id": "fern", "hsl": "118 19% 41%", "locked": true },
    { "id": "ferrum", "hsl": "22 76% 36%", "locked": true }
  ],
  "schemes": {
    "light": {
      "background": { "baseColorId": "linen" },
      "foreground": { "baseColorId": "kalamata" },
      "primary": { "baseColorId": "fern" },
      "primary-foreground": { "baseColorId": "optical" }
    },
    "dark": {
      "background": { "baseColorId": "thorn" },
      "foreground": { "baseColorId": "linen" },
      "primary": { "baseColorId": "thorn" },
      "primary-foreground": { "baseColorId": "linen" }
    }
  }
}
```

## Runtime Application

`AppThemeProvider` injects the JSON into `ThemeProvider`, which converts semantic roles into CSS variables (`--background`, `--primary`, etc). Tailwind utilities (e.g. `bg-primary`) resolve to `hsl(var(--primary))` automatically.

## Editing Workflow

1. **Interactive:** Visit `/theme-lab` → adjust palette and role mappings live. Contrast badges surface WCAG compliance.
2. **JSON Manual:** Edit `portfolio-theme-final.json` directly; keep HSL formatting consistent. Avoid adding `hsl()` wrappers; store raw triplets.
3. **Import/Export:** Use Theme Lab buttons (or shortcuts `I` / `E`) to serialize / restore complete token sets.
4. **Sharing:** The Theme Lab can encode the entire theme in a base64 URL param; recipients load the theme instantly.

## Adding Shades (Optional)

Each palette color supports a `scale` array of entries: `{ key: "500", hsl: "..." }`. When present, a role may specify `shadeKey` to pick a specific shade. Generate scales via Theme Lab; scales use perceptual OKLCH lightness progression for consistency.

## Contrast & Accessibility

- Target normal text contrast ≥ 4.5:1 (AA) and large text/UI ≥ 3:1.
- Adjust only lightness first; saturation changes can shift perceived readability.
- Use Theme Lab’s contrast badges to validate primary / secondary / accent foreground pairs.

## Brand Locks Rationale

Locked colors prevent accidental palette drift during experimentation. They are especially helpful when running color exploration sessions—designers can remix supporting colors while the primary brand identity stays stable.

## Extending the Theme

- **Add a color:** Append a new object to `palette` with unique `id`; generate a scale if you need shade variation.
- **New semantic role:** Add a key to both `schemes.light` and `schemes.dark`, update components to consume via Tailwind variable or custom `var(--your-role)`.
- **Feature flagging:** Future multi-theme support can swap JSON files or fetch remote theme tokens before hydration.

## Best Practices

- Prefer semantic role changes over direct palette edits for UI tweaks.
- Run the contrast audit script (`node scripts/contrast-audit.mjs`) after significant adjustments.
- Keep palette size modest (8–12 colors) to reduce decision fatigue.
- Document any newly locked colors with rationale (marketing, accessibility, legacy brand equity).

## Troubleshooting

| Issue                | Cause                             | Fix                                       |
| -------------------- | --------------------------------- | ----------------------------------------- |
| Color doesn’t change | Edited hex instead of HSL triplet | Update to `H S% L%` format                |
| Poor contrast badge  | Insufficient lightness delta      | Adjust `L%` or pick alternate baseColorId |
| Scale not generated  | No `scale` entries in JSON        | Use Theme Lab “Generate Scale”            |
| Variable missing     | Role absent in scheme             | Add role mapping to both schemes          |

## Roadmap (Future Considerations)

- Multiple theme presets & user selection
- Automatic dark scheme derivation from light palette
- Export to design tokens formats (Style Dictionary, CSS-in-JS)
- Optional motion tokens (`--transition-fast`, etc)

---

Maintained as part of the Portfolio project. For deeper technical detail see `app/theme-lab/README.md`.
