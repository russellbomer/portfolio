"use client";

/**
 * RoleMappingEditor component
 * Assign semantic roles with lock indicators and contrast checking
 */
import { roleGroups } from "@/lib/theme/role-groups";
import type {
  BaseColor,
  RoleMapping,
  SchemeName,
  SemanticRole,
} from "@/types/theme";
import { semanticRoles } from "@/types/theme";
import { useEffect, useRef, useState } from "react";
import { ContrastBadge } from "./ContrastBadge";

interface RoleMappingEditorProps {
  scheme: SchemeName;
  mapping: RoleMapping;
  palette: BaseColor[];
  onChange: (mapping: RoleMapping) => void;
  highlightedRole?: SemanticRole | null;
  onClearHighlight?: () => void;
}

const groupedRoles = roleGroups.flatMap((group) => group.roles);

const missingRoles = semanticRoles.filter(
  (role) => !groupedRoles.includes(role)
);

if (missingRoles.length > 0 && process.env.NODE_ENV !== "production") {
  console.warn("RoleMappingEditor missing role groups for:", missingRoles);
}

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
  highlightedRole,
  onClearHighlight,
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
    onClearHighlight?.();
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
    onClearHighlight?.();
    onChange(newMapping);
  };

  const roleRefs = useRef<Record<SemanticRole, HTMLDivElement | null>>(
    {} as Record<SemanticRole, HTMLDivElement | null>
  );

  useEffect(() => {
    if (!highlightedRole) return;
    const node = roleRefs.current[highlightedRole];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    const select = node.querySelector("select");
    if (select instanceof HTMLSelectElement) {
      select.focus({ preventScroll: true });
    }
  }, [highlightedRole]);

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{scheme} Scheme</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={randomizeMapping}
            className="h-8 rounded-md border border-neutral-300 bg-white px-3 text-xs text-black hover:bg-neutral-100"
            title="Randomize unlocked roles"
          >
            Randomize
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {roleGroups.map((group) => (
          <section key={group.id} className="space-y-2">
            <h4 className="text-sm font-semibold">{group.title}</h4>
            <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3">
              {group.roles.map((role) => {
                const entry = mapping[role];
                const baseColorId = entry?.baseColorId ?? "";
                const shadeKey = entry?.shadeKey;
                const baseColor = palette.find((c) => c.id === baseColorId);
                const locked = isLocked(role);
                const isHighlighted = highlightedRole === role;
                const previewColor = (() => {
                  if (!baseColor) return null;
                  if (shadeKey && baseColor.scale.length > 0) {
                    const shade = baseColor.scale.find(
                      (s) => s.key === shadeKey
                    );
                    return shade?.hsl ?? baseColor.hsl;
                  }
                  return baseColor.hsl;
                })();

                return (
                  <div
                    key={role}
                    ref={(node) => {
                      roleRefs.current[role] = node;
                    }}
                    data-role-row={role}
                    className={`flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-2 py-2 transition-shadow ${
                      isHighlighted
                        ? "border-blue-500 shadow-sm ring-1 ring-blue-400"
                        : ""
                    }`}
                  >
                    <div className="flex w-44 flex-col text-xs text-black">
                      <span className="font-medium capitalize">{role}</span>
                      {baseColor && (
                        <span className="text-neutral-500">
                          {baseColor.name}
                          {shadeKey ? ` • ${shadeKey}` : ""}
                        </span>
                      )}
                    </div>

                    <select
                      value={baseColorId}
                      onChange={(event) =>
                        handleRoleChange(role, event.target.value, undefined)
                      }
                      disabled={locked}
                      className="h-8 flex-1 rounded-md border border-neutral-300 bg-white px-2 text-xs text-black disabled:opacity-50"
                    >
                      <option value="">Select color</option>
                      {palette.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.name}
                          {color.locked ? " 🔒" : ""}
                        </option>
                      ))}
                    </select>

                    {baseColor && baseColor.scale.length > 0 && (
                      <select
                        value={shadeKey ?? ""}
                        onChange={(event) =>
                          handleRoleChange(
                            role,
                            baseColorId,
                            event.target.value || undefined
                          )
                        }
                        disabled={locked}
                        className="h-8 w-24 rounded-md border border-neutral-300 bg-white px-2 text-xs text-black disabled:opacity-50"
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
                      className="h-8 w-8 shrink-0 rounded border border-neutral-200"
                      style={{
                        backgroundColor: previewColor
                          ? `hsl(${previewColor})`
                          : "transparent",
                      }}
                      aria-label={`Preview color for ${role}`}
                    />

                    <button
                      type="button"
                      onClick={() => toggleRoleLock(role)}
                      className={`text-xs ${
                        locked ? "text-amber-600" : "text-neutral-500"
                      }`}
                      title={locked ? "Unlock role" : "Lock role"}
                    >
                      {locked ? "🔒" : "🔓"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Contrast Checks</h4>
        <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3">
          {contrastPairs.map(({ fg, bg, label }) => {
            const fgColor = getColorForRole(fg);
            const bgColor = getColorForRole(bg);

            if (!fgColor || !bgColor) {
              return null;
            }

            return (
              <div
                key={`${fg}-${bg}`}
                className="flex items-center justify-between text-xs text-black"
              >
                <span className="font-medium text-neutral-600">{label}</span>
                <ContrastBadge foreground={fgColor} background={bgColor} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
