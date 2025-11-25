/**
 * Theme types for the Theme Lab
 * All colors use HSL triplet format: "H S% L%" (no alpha)
 */

export type Hsl = `${number} ${number}% ${number}%`;

export type ShadeStop = {
  key: string; // "50" | "100" | "200" | ... or custom
  hsl: Hsl;
};

export type BaseColor = {
  id: string; // e.g., "fern"
  name: string; // e.g., "Fern"
  hsl: Hsl; // base swatch
  scale: ShadeStop[]; // may be empty; can be generated
  locked?: boolean; // true for brand colors
};

export const semanticRoles = [
  "background",
  "foreground",
  "muted",
  "muted-foreground",
  "popover",
  "popover-foreground",
  "card",
  "card-foreground",
  "border",
  "input",
  "ring",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "subtle-background",
  "subtle-foreground",
  "body-background",
  "section-background",
  "page-border",
  "page-ring",
  "surface-default",
  "surface-default-foreground",
  "surface-muted",
  "surface-muted-foreground",
  "surface-contrast",
  "surface-contrast-foreground",
  "surface-overlay",
  "surface-overlay-foreground",
  "header-background",
  "header-foreground",
  "header-border",
  "header-active",
  "header-active-foreground",
  "nav-link",
  "nav-link-hover",
  "nav-link-active",
  "nav-link-muted",
  "footer-background",
  "footer-foreground",
  "footer-border",
  "footer-accent",
  "footer-accent-foreground",
  "breadcrumb-background",
  "breadcrumb-foreground",
  "breadcrumb-active",
  "breadcrumb-separator",
  "sidebar-background",
  "sidebar-foreground",
  "sidebar-active",
  "sidebar-border",
  "hero-background",
  "hero-foreground",
  "hero-accent",
  "hero-accent-foreground",
  "cta-background",
  "cta-foreground",
  "cta-border",
  "cta-ring",
  "cta-hover",
  "testimonial-background",
  "testimonial-foreground",
  "testimonial-emphasis",
  "metrics-background",
  "metrics-foreground",
  "metric-positive",
  "metric-negative",
  "timeline-background",
  "timeline-foreground",
  "timeline-marker",
  "timeline-connector",
  "table-header",
  "table-header-foreground",
  "table-row",
  "table-row-foreground",
  "table-row-alt",
  "table-row-alt-foreground",
  "code-background",
  "code-foreground",
  "code-border",
  "code-accent",
  "quote-background",
  "quote-foreground",
  "quote-border",
  "quote-accent",
  "form-background",
  "form-foreground",
  "input-background",
  "input-foreground",
  "input-placeholder",
  "input-border",
  "input-ring",
  "tag-background",
  "tag-foreground",
  "tag-border",
  "tag-active",
  "success",
  "success-foreground",
  "success-muted",
  "success-border",
  "warning",
  "warning-foreground",
  "warning-muted",
  "warning-border",
  "info",
  "info-foreground",
  "info-muted",
  "info-border",
  "error",
  "error-foreground",
  "error-muted",
  "error-border",
  "focus-ring",
  "active-ring",
  "disabled-background",
  "disabled-foreground",
  "tooltip-background",
  "tooltip-foreground",
  "tooltip-border",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  "chart-8",
  "chart-accent",
  "chart-grid",
  "chart-axis",
  "avatar-background",
  "avatar-foreground",
  "avatar-ring",
  "modal-background",
  "modal-foreground",
  "modal-overlay",
  "modal-border",
  "video-overlay",
  "video-controls",
  "gallery-background",
  "gallery-foreground",
  "terminal-background",
  "terminal-foreground",
  "terminal-cursor",
  "terminal-prompt",
  "brand-primary",
  "brand-secondary",
  "brand-tertiary",
  "link",
  "link-hover",
  "link-muted",
  "link-visited",
  "shadow-color",
  "divider",
  "scrim",
  "selection",
  "background-inverse",
  "foreground-inverse",
  "overlay-backdrop",
  "overlay-foreground",
] as const;

export type SemanticRole = (typeof semanticRoles)[number];

export type RoleMapping = Record<
  SemanticRole,
  { baseColorId: string; shadeKey?: string }
>;

export type SchemeName = "light" | "dark";

export type ThemeTokens = {
  name: string;
  version: 1;
  metadata?: Record<string, string | number | boolean>;
  palette: BaseColor[];
  schemes: Record<SchemeName, RoleMapping>;
};

/**
 * Helper type for contrast checking
 */
export type ContrastPair = {
  role: SemanticRole;
  backgroundRole: SemanticRole;
  targetRatio: number; // 4.5 for normal text, 3.0 for large/UI
  label: string;
};

/**
 * Keyboard shortcuts
 */
export type ThemeLabShortcut =
  | "import" // i
  | "export" // e
  | "share" // s
  | "toggleScheme" // d
  | "compare" // c
  | "reset"; // r
