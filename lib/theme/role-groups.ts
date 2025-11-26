import type { SemanticRole } from "@/types/theme";

type RoleGroup = {
  id: RoleGroupId;
  title: string;
  description: string;
  roles: SemanticRole[];
};

type RoleGroupId =
  | "foundations"
  | "shadcn-core"
  | "navigation"
  | "feature-sections"
  | "content-forms"
  | "feedback-status"
  | "media-data";

export const foundationRoles: SemanticRole[] = [
  "background",
  "foreground",
  "subtle-background",
  "subtle-foreground",
  "body-background",
  "section-background",
  "background-inverse",
  "foreground-inverse",
  "overlay-backdrop",
  "overlay-foreground",
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
  "shadow-color",
  "divider",
  "scrim",
  "selection",
];

export const shadcnCoreRoles: SemanticRole[] = [
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
];

export const navigationRoles: SemanticRole[] = [
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
];

export const featureRoles: SemanticRole[] = [
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
];

export const contentRoles: SemanticRole[] = [
  "form-background",
  "form-foreground",
  "input-background",
  "input-foreground",
  "input-placeholder",
  "input-border",
  "input-ring",
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
  "tag-background",
  "tag-foreground",
  "tag-border",
  "tag-active",
  "tooltip-background",
  "tooltip-foreground",
  "tooltip-border",
  "gallery-background",
  "gallery-foreground",
  "link",
  "link-hover",
  "link-muted",
  "link-visited",
];

export const actionsFeedbackRoles: SemanticRole[] = [
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
  "brand-primary",
  "brand-secondary",
  "brand-tertiary",
];

export const mediaRoles: SemanticRole[] = [
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
  "terminal-background",
  "terminal-foreground",
  "terminal-cursor",
  "terminal-prompt",
];

export const roleGroups: RoleGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    description: "Global surfaces, overlays, and structural tokens",
    roles: foundationRoles,
  },
  {
    id: "shadcn-core",
    title: "Core UI",
    description: "shadcn/ui primitives and base interactive roles",
    roles: shadcnCoreRoles,
  },
  {
    id: "navigation",
    title: "Navigation",
    description: "Headers, sidebars, breadcrumbs, and footer tokens",
    roles: navigationRoles,
  },
  {
    id: "feature-sections",
    title: "Feature Sections",
    description: "Hero, CTA, testimonial, metrics, and timeline roles",
    roles: featureRoles,
  },
  {
    id: "content-forms",
    title: "Content & Forms",
    description: "Typography, tables, tags, tooltips, and forms",
    roles: contentRoles,
  },
  {
    id: "feedback-status",
    title: "Feedback & Status",
    description: "Success, warning, info, error, focus, and brand tokens",
    roles: actionsFeedbackRoles,
  },
  {
    id: "media-data",
    title: "Media & Data",
    description: "Charts, avatars, modals, video, and terminal tokens",
    roles: mediaRoles,
  },
];

export type { RoleGroup, RoleGroupId };
