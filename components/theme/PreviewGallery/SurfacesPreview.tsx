"use client";

/**
 * Foundations preview
 * Highlights core surfaces, overlays, and structural tokens
 */
import { Card } from "@/components/ui/card";
import type { SemanticRole } from "@/types/theme";
import type { KeyboardEvent, MouseEvent } from "react";

const role = (token: string) => `hsl(var(--${token}))`;

interface FoundationsPreviewProps {
  onRoleActivate?: (role: SemanticRole) => void;
}

export function FoundationsPreview({
  onRoleActivate,
}: FoundationsPreviewProps) {
  const notifyRole = (
    event: MouseEvent<HTMLElement>,
    semanticRole: SemanticRole
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onRoleActivate?.(semanticRole);
  };

  const notifyRoleKey = (
    event: KeyboardEvent<HTMLElement>,
    semanticRole: SemanticRole
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRoleActivate?.(semanticRole);
    }
  };

  const interactiveProps = (semanticRole: SemanticRole, title: string) => ({
    "data-role": semanticRole,
    role: "button" as const,
    tabIndex: 0,
    title,
    onClick: (event: MouseEvent<HTMLElement>) =>
      notifyRole(event, semanticRole),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) =>
      notifyRoleKey(event, semanticRole),
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Structural Surfaces</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className="p-6"
            style={{
              backgroundColor: role("surface-default"),
              color: role("surface-default-foreground"),
              boxShadow: `0 12px 32px -18px ${role("shadow-color")}`,
            }}
            {...interactiveProps(
              "surface-default",
              "Jump to surface-default role"
            )}
          >
            <h4
              className="mb-2 cursor-pointer text-base font-semibold"
              {...interactiveProps(
                "surface-default-foreground",
                "Jump to surface-default-foreground role"
              )}
            >
              Default Surface
            </h4>
            <p
              className="cursor-pointer text-sm"
              style={{ color: role("subtle-foreground") }}
              {...interactiveProps(
                "subtle-foreground",
                "Jump to subtle-foreground role"
              )}
            >
              This card uses the default surface tokens with the global shadow.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium"
              style={{ color: role("shadow-color") }}
              {...interactiveProps("shadow-color", "Jump to shadow-color role")}
            >
              Shadow color preview
            </span>
          </Card>

          <Card
            className="p-6"
            style={{
              backgroundColor: role("surface-muted"),
              color: role("surface-muted-foreground"),
              borderColor: role("divider"),
            }}
            {...interactiveProps("surface-muted", "Jump to surface-muted role")}
          >
            <h4
              className="mb-2 cursor-pointer text-base font-semibold"
              {...interactiveProps(
                "surface-muted-foreground",
                "Jump to surface-muted-foreground role"
              )}
            >
              Muted Surface
            </h4>
            <p
              className="cursor-pointer text-sm"
              style={{ color: role("subtle-foreground") }}
              {...interactiveProps(
                "subtle-foreground",
                "Jump to subtle-foreground role"
              )}
            >
              Muted surfaces help create gentle separation between sections.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                className="rounded-md px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: role("primary"),
                  color: role("primary-foreground"),
                }}
                data-role="primary"
                onClick={(event) => notifyRole(event, "primary")}
                onKeyDown={(event) => notifyRoleKey(event, "primary")}
              >
                Action
              </button>
              <button
                className="rounded-md border px-3 py-1 text-sm transition-colors"
                style={{
                  borderColor: role("border"),
                  color: role("surface-muted-foreground"),
                }}
                data-role="border"
                onClick={(event) => notifyRole(event, "border")}
                onKeyDown={(event) => notifyRoleKey(event, "border")}
              >
                Cancel
              </button>
            </div>
            <div
              className="mt-4 rounded-md border p-3 text-xs"
              style={{
                backgroundColor: role("accent"),
                color: role("accent-foreground"),
                borderColor: role("divider"),
              }}
              {...interactiveProps("accent", "Jump to accent role")}
            >
              Accent surfaces highlight secondary emphasis areas.
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Layers & Overlays</h3>
        <div className="space-y-4">
          <div
            className="rounded-md border p-4 shadow-md"
            style={{
              backgroundColor: role("popover"),
              color: role("popover-foreground"),
              borderColor: role("border"),
            }}
            {...interactiveProps("popover", "Jump to popover role")}
          >
            <h4
              className="mb-2 cursor-pointer font-semibold"
              {...interactiveProps(
                "popover-foreground",
                "Jump to popover-foreground role"
              )}
            >
              Popover Surface
            </h4>
            <p
              className="cursor-pointer text-sm"
              {...interactiveProps(
                "popover-foreground",
                "Jump to popover-foreground role"
              )}
            >
              Popover tokens ensure floating surfaces stay legible on any theme.
            </p>
          </div>

          <div
            className="rounded-md p-4"
            style={{
              backgroundColor: role("muted"),
              color: role("muted-foreground"),
            }}
            {...interactiveProps("muted", "Jump to muted role")}
          >
            <p
              className="cursor-pointer text-sm"
              {...interactiveProps(
                "muted-foreground",
                "Jump to muted-foreground role"
              )}
            >
              Pair muted backgrounds with foreground tokens for balance.
            </p>
            <button
              className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs"
              style={{
                backgroundColor: role("foreground"),
                color: role("background"),
                borderColor: role("border"),
              }}
              data-role="foreground"
              onClick={(event) => notifyRole(event, "foreground")}
              onKeyDown={(event) => notifyRoleKey(event, "foreground")}
            >
              Foreground token sample
            </button>
          </div>

          <div
            className="rounded-md p-4"
            style={{
              backgroundColor: role("code-background"),
              color: role("code-foreground"),
            }}
            {...interactiveProps(
              "code-background",
              "Jump to code-background role"
            )}
          >
            <h4 className="mb-2 font-semibold">Code Surface</h4>
            <p className="text-sm">
              Specialized surfaces like code blocks can reuse semantic tokens.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Overlays & Scrims</h3>
        <div
          className="relative overflow-hidden rounded-lg border"
          style={{ borderColor: role("divider") }}
          {...interactiveProps("background", "Jump to background role")}
        >
          <div
            className="p-6"
            style={{
              backgroundColor: role("background"),
              color: role("foreground"),
            }}
          >
            <h4
              className="cursor-pointer text-base font-semibold"
              {...interactiveProps("foreground", "Jump to foreground role")}
            >
              Base Content
            </h4>
            <p
              className="mt-2 cursor-pointer text-sm"
              style={{ color: role("subtle-foreground") }}
              {...interactiveProps(
                "subtle-foreground",
                "Jump to subtle-foreground role"
              )}
            >
              Overlay roles are useful for modals, drawers, and spotlight
              moments.
            </p>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center px-6 text-center"
            style={{
              backgroundColor: `hsl(var(--overlay-backdrop) / 0.5)`,
              color: role("overlay-foreground"),
            }}
            {...interactiveProps(
              "overlay-backdrop",
              "Jump to overlay-backdrop role"
            )}
          >
            <div
              className="rounded-md border px-4 py-3 text-sm shadow-lg"
              style={{
                backgroundColor: role("modal-background"),
                borderColor: role("modal-border"),
                color: role("modal-foreground"),
                boxShadow: `0 14px 40px -20px ${role("shadow-color")}`,
              }}
              {...interactiveProps(
                "modal-background",
                "Jump to modal-background role"
              )}
            >
              <span
                className="cursor-pointer"
                {...interactiveProps(
                  "modal-foreground",
                  "Jump to modal-foreground role"
                )}
              >
                Overlay backdrop & scrim roles provide contrast for layered UI.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
