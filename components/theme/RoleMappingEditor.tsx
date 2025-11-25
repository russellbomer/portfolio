"use client";

/**
 * RoleMappingEditor component
 * Assign semantic roles with lock indicators and contrast checking
 */
import type {
  BaseColor,
  RoleMapping,
  SchemeName,
  SemanticRole,
} from "@/types/theme";
import { semanticRoles } from "@/types/theme";
import { useState } from "react";
import { ContrastBadge } from "./ContrastBadge";

interface RoleMappingEditorProps {
  scheme: SchemeName;
  mapping: RoleMapping;
  palette: BaseColor[];
  onChange: (mapping: RoleMapping) => void;
}

const foundationRoles: SemanticRole[] = [
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

const shadcnCoreRoles: SemanticRole[] = [
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

const navigationRoles: SemanticRole[] = [
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

const featureRoles: SemanticRole[] = [
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

const contentRoles: SemanticRole[] = [
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

const actionsFeedbackRoles: SemanticRole[] = [
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

const mediaRoles: SemanticRole[] = [
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

const groupedRoles = [
  ...foundationRoles,
  ...shadcnCoreRoles,
  ...navigationRoles,
  ...featureRoles,
  ...contentRoles,
  ...actionsFeedbackRoles,
  ...mediaRoles,
];

const missingRoles = semanticRoles.filter(
  (role) => !groupedRoles.includes(role)
);

if (missingRoles.length > 0 && process.env.NODE_ENV !== "production") {
  console.warn("RoleMappingEditor missing role groups for:", missingRoles);
}

const roleGroups: { title: string; roles: SemanticRole[] }[] = [
  { title: "Foundations", roles: foundationRoles },
  { title: "Shadcn Core", roles: shadcnCoreRoles },
  { title: "Navigation", roles: navigationRoles },
  { title: "Feature Sections", roles: featureRoles },
  { title: "Content & Forms", roles: contentRoles },
  { title: "Feedback & Status", roles: actionsFeedbackRoles },
  { title: "Media & Data", roles: mediaRoles },
];

const contrastPairs: Array<{
  fg: SemanticRole;
  bg: SemanticRole;
  label: string;
}> = [
  { fg: "foreground", bg: "background", label: "Base text" },
  {
    fg: "surface-default-foreground",
    bg: "surface-default",
    label: "Default surface",
  },
  {
    fg: "surface-muted-foreground",
    bg: "surface-muted",
    label: "Muted surface",
  },
  { fg: "header-foreground", bg: "header-background", label: "Header" },
  { fg: "footer-foreground", bg: "footer-background", label: "Footer" },
  { fg: "primary-foreground", bg: "primary", label: "Primary button" },
  {
    fg: "secondary-foreground",
    bg: "secondary",
    label: "Secondary button",
  },
  { fg: "cta-foreground", bg: "cta-background", label: "CTA" },
  { fg: "accent-foreground", bg: "accent", label: "Accent" },
  { fg: "destructive-foreground", bg: "destructive", label: "Destructive" },
  { fg: "success-foreground", bg: "success", label: "Success" },
  { fg: "warning-foreground", bg: "warning", label: "Warning" },
  { fg: "info-foreground", bg: "info", label: "Info" },
  { fg: "error-foreground", bg: "error", label: "Error" },
  { fg: "card-foreground", bg: "card", label: "Card" },
  { fg: "popover-foreground", bg: "popover", label: "Popover" },
  { fg: "muted-foreground", bg: "muted", label: "Muted" },
  {
    fg: "tooltip-foreground",
    bg: "tooltip-background",
    label: "Tooltip",
  },
  {
    fg: "terminal-foreground",
    bg: "terminal-background",
    label: "Terminal",
  },
];

export function RoleMappingEditor({
  scheme,
  mapping,
  palette,
  onChange,
}: RoleMappingEditorProps) {
  // Local role-level lock state (UI-only)
  const [roleLocks, setRoleLocks] = useState<Record<SemanticRole, boolean>>(
    () => {
      const init: Partial<Record<SemanticRole, boolean>> = {};
      semanticRoles.forEach((role) => {
        init[role] = false;
      });
      return init as Record<SemanticRole, boolean>;
    }
  );

  const toggleRoleLock = (role: SemanticRole) => {
    setRoleLocks((prev) => ({ ...prev, [role]: !prev[role] }));
  };
  const handleRoleChange = (
    role: SemanticRole,
    baseColorId: string,
    shadeKey?: string
  ) => {
    if (roleLocks[role]) return; // ignore changes on locked roles
    if (!baseColorId) {
      return;
    }
    onChange({
      ...mapping,
      [role]: { baseColorId, shadeKey },
    });
  };

  const getColorForRole = (role: SemanticRole) => {
    const entry = mapping[role];
    if (!entry) return null;

    const { baseColorId, shadeKey } = entry;
    const baseColor = palette.find((c) => c.id === baseColorId);
    if (!baseColor) return null;

    if (shadeKey && baseColor.scale.length > 0) {
      const shade = baseColor.scale.find((s) => s.key === shadeKey);
      return shade?.hsl || baseColor.hsl;
    }

    return baseColor.hsl;
  };

  const isLocked = (role: SemanticRole) => {
    // Row-level lock indicator
    return roleLocks[role] === true;
  };

  // Randomize unlocked roles
  const randomizeMapping = () => {
    const roles = semanticRoles;
    const newMapping: RoleMapping = { ...(mapping as RoleMapping) };
    roles.forEach((role) => {
      if (roleLocks[role]) return;
      const randomBase = palette[Math.floor(Math.random() * palette.length)];
      if (!randomBase) return;
      let shadeKey: string | undefined = undefined;
      if (randomBase.scale && randomBase.scale.length > 0) {
        const pick =
          randomBase.scale[Math.floor(Math.random() * randomBase.scale.length)];
        shadeKey = pick?.key;
      }
      newMapping[role] = { baseColorId: randomBase.id, shadeKey };
    });
    onChange(newMapping);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{scheme} Scheme</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={randomizeMapping}
            className="h-8 rounded-md border bg-background px-3 text-xs hover:bg-accent hover:text-accent-foreground"
            title="Randomize unlocked roles"
          >
            Randomize
          </button>
        </div>
      </div>

      {/* Role assignments */}
      <div className="space-y-4">
        {roleGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {group.title}
            </h4>
            <div className="space-y-2 rounded-lg border bg-card p-3">
              {group.roles.map((role) => {
                const entry = mapping[role];
                const baseColorId = entry?.baseColorId ?? "";
                const shadeKey = entry?.shadeKey;
                const baseColor = palette.find((c) => c.id === baseColorId);
                const locked = isLocked(role);
                const showPlaceholder = !entry;

                return (
                  <div key={role} className="flex items-center gap-3">
                    <div className="w-40 text-xs font-medium">{role}</div>
                    <select
                      value={baseColorId}
                      onChange={(e) =>
                        handleRoleChange(role, e.target.value, shadeKey)
                      }
                      disabled={locked}
                      className="h-8 flex-1 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
                    >
                      <option value="">
                        {showPlaceholder ? "Select color" : "Unassigned"}
                      </option>
                      {palette.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.name} {color.locked ? "🔒" : ""}
                        </option>
                      ))}
                    </select>
                    {baseColor && baseColor.scale.length > 0 && (
                      <select
                        value={shadeKey || ""}
                        onChange={(e) =>
                          handleRoleChange(
                            role,
                            baseColorId,
                            e.target.value || undefined
                          )
                        }
                        disabled={locked}
                        className="h-8 w-20 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
                      >
                        <option value="">Base</option>
                        {baseColor.scale.map((shade) => (
                          <option key={shade.key} value={shade.key}>
                            {shade.key}
                          </option>
                        ))}
                      </select>
                    )}
                    <div
                      className="h-8 w-8 shrink-0 rounded border-2 bg-[color:var(--color-card)]"
                      style={{
                        backgroundColor: baseColor
                          ? `hsl(${getColorForRole(role)})`
                          : "hsl(var(--muted))",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => toggleRoleLock(role)}
                      className={`text-xs ${
                        locked ? "text-amber-600" : "text-muted-foreground"
                      }`}
                      title={locked ? "Unlock role" : "Lock role"}
                    >
                      {locked ? "🔒" : "🔓"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contrast checks */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Contrast Checks
        </h4>
        <div className="space-y-2 rounded-lg border bg-card p-3">
          {contrastPairs.map(({ fg, bg, label }) => {
            const fgColor = getColorForRole(fg);
            const bgColor = getColorForRole(bg);

            if (!fgColor || !bgColor) return null;

            return (
              <div
                key={`${fg}-${bg}`}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{label}</span>
                <ContrastBadge foreground={fgColor} background={bgColor} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
