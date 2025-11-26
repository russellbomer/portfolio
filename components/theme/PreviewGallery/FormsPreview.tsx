"use client";

/**
 * Core UI preview
 * Demonstrates shadcn/ui primitives and base interactive tokens
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SemanticRole } from "@/types/theme";
import type { KeyboardEvent, MouseEvent } from "react";
import { useState } from "react";

const role = (token: string) => `hsl(var(--${token}))`;

interface CorePreviewProps {
  onRoleActivate?: (role: SemanticRole) => void;
}

export function CorePreview({ onRoleActivate }: CorePreviewProps) {
  const [inputValue, setInputValue] = useState("");

  const emitRoles = (semanticRoles: SemanticRole | SemanticRole[]) => {
    const roles = Array.isArray(semanticRoles)
      ? semanticRoles
      : [semanticRoles];
    roles.forEach((role) => onRoleActivate?.(role));
  };

  const notifyRole = (
    event: MouseEvent<HTMLElement>,
    semanticRoles: SemanticRole | SemanticRole[]
  ) => {
    event.preventDefault();
    event.stopPropagation();
    emitRoles(semanticRoles);
  };

  const notifyRoleKey = (
    event: KeyboardEvent<HTMLElement>,
    semanticRoles: SemanticRole | SemanticRole[]
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      emitRoles(semanticRoles);
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
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "form-foreground",
            "Jump to form-foreground role"
          )}
        >
          Button Variants
        </h3>
        <div
          className="flex flex-wrap gap-3 rounded-lg border p-4"
          style={{
            backgroundColor: role("form-background"),
            color: role("form-foreground"),
            borderColor: role("page-border"),
          }}
          onClick={(event) => notifyRole(event, "form-background")}
          onKeyDown={(event) => notifyRoleKey(event, "form-background")}
        >
          <Button
            onClick={(event) => notifyRole(event, "primary")}
            onKeyDown={(event) => notifyRoleKey(event, "primary")}
            data-role="primary"
            title="Jump to primary role"
          >
            Primary
          </Button>
          <Button
            variant="secondary"
            onClick={(event) => notifyRole(event, "secondary")}
            onKeyDown={(event) => notifyRoleKey(event, "secondary")}
            data-role="secondary"
            title="Jump to secondary role"
          >
            Secondary
          </Button>
          <Button
            variant="outline"
            onClick={(event) => notifyRole(event, "border")}
            onKeyDown={(event) => notifyRoleKey(event, "border")}
            data-role="border"
            title="Jump to border role"
          >
            Outline
          </Button>
          <Button
            variant="ghost"
            onClick={(event) => notifyRole(event, "accent")}
            onKeyDown={(event) => notifyRoleKey(event, "accent")}
            data-role="accent"
            title="Jump to accent role"
          >
            Ghost
          </Button>
          <Button
            variant="destructive"
            onClick={(event) =>
              notifyRole(event, ["destructive", "destructive-foreground"])
            }
            onKeyDown={(event) =>
              notifyRoleKey(event, ["destructive", "destructive-foreground"])
            }
            data-role="destructive"
            title="Jump to destructive and destructive-foreground roles"
          >
            Destructive
          </Button>
          <Button
            disabled
            onClick={(event) => notifyRole(event, "disabled-background")}
            onKeyDown={(event) => notifyRoleKey(event, "disabled-background")}
            data-role="disabled-background"
            title="Jump to disabled roles"
          >
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "form-foreground",
            "Jump to form-foreground role"
          )}
        >
          Button Sizes
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      <div>
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "form-foreground",
            "Jump to form-foreground role"
          )}
        >
          Input Fields
        </h3>
        <div
          className="max-w-md space-y-4 rounded-lg border p-5"
          style={{
            backgroundColor: role("form-background"),
            color: role("form-foreground"),
            borderColor: role("page-border"),
          }}
          data-role="form-background"
          role="button"
          tabIndex={0}
          title="Jump to form-background role"
          onClick={(event) => notifyRole(event, "form-background")}
          onKeyDown={(event) => notifyRoleKey(event, "form-background")}
        >
          <div className="space-y-2">
            <Label
              htmlFor="input-default"
              style={{ color: role("form-foreground") }}
              className="cursor-pointer"
              {...interactiveProps(
                "form-foreground",
                "Jump to form-foreground role"
              )}
            >
              Default Input
            </Label>
            <Input
              id="input-default"
              placeholder="Enter text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
              }}
              data-role="input-background"
              onClick={(event) => notifyRole(event, "input-background")}
              onKeyDown={(event) => notifyRoleKey(event, "input-background")}
            />
            <p className="text-xs" style={{ color: role("input-placeholder") }}>
              <span
                className="cursor-pointer"
                {...interactiveProps(
                  "input-placeholder",
                  "Jump to input-placeholder role"
                )}
              >
                Placeholder text uses the input placeholder role.
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="input-disabled"
              style={{ color: role("form-foreground") }}
              className="cursor-pointer"
              {...interactiveProps(
                "form-foreground",
                "Jump to form-foreground role"
              )}
            >
              Disabled Input
            </Label>
            <Input
              id="input-disabled"
              placeholder="Disabled..."
              disabled
              style={{
                backgroundColor: role("disabled-background"),
                color: role("disabled-foreground"),
                borderColor: role("input-border"),
              }}
              data-role="disabled-background"
              onClick={(event) => notifyRole(event, "disabled-background")}
              onKeyDown={(event) => notifyRoleKey(event, "disabled-background")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="input-email"
              style={{ color: role("form-foreground") }}
              className="cursor-pointer"
              {...interactiveProps(
                "form-foreground",
                "Jump to form-foreground role"
              )}
            >
              Email Input
            </Label>
            <Input
              id="input-email"
              type="email"
              placeholder="email@example.com"
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
              }}
              data-role="input-background"
              onClick={(event) => notifyRole(event, "input-background")}
              onKeyDown={(event) => notifyRoleKey(event, "input-background")}
            />
          </div>
        </div>
      </div>
      <div>
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "form-foreground",
            "Jump to form-foreground role"
          )}
        >
          Form Accents
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="rounded-lg border p-4 text-sm"
            style={{
              backgroundColor: role("surface-overlay"),
              borderColor: role("cta-ring"),
              color: role("surface-overlay-foreground"),
              boxShadow: `0 0 0 2px ${role("input-ring")}`,
            }}
            data-role="input-ring"
            role="button"
            tabIndex={0}
            title="Jump to input-ring role"
            onClick={(event) => notifyRole(event, "input-ring")}
            onKeyDown={(event) => notifyRoleKey(event, "input-ring")}
          >
            Focus ring token <span className="font-medium">input-ring</span>
            drives the outline you see here.
          </div>
          <div
            className="rounded-lg border p-4 text-sm"
            style={{
              backgroundColor: role("surface-muted"),
              borderColor: role("active-ring"),
              color: role("surface-muted-foreground"),
            }}
            data-role="active-ring"
            role="button"
            tabIndex={0}
            title="Jump to active-ring role"
            onClick={(event) => notifyRole(event, "active-ring")}
            onKeyDown={(event) => notifyRoleKey(event, "active-ring")}
          >
            Use <span className="font-medium">active-ring</span> for pressed or
            active states on interactive controls.
          </div>
          <div
            className="rounded-lg border p-4 text-sm"
            style={{
              backgroundColor: role("destructive"),
              borderColor: role("page-border"),
              color: role("destructive-foreground"),
            }}
            data-role="destructive"
            role="button"
            tabIndex={0}
            title="Jump to destructive role"
            onClick={(event) => notifyRole(event, "destructive")}
            onKeyDown={(event) => notifyRoleKey(event, "destructive")}
          >
            <p className="font-semibold">Destructive action</p>
            <p className="mt-1 text-xs opacity-80">
              Pair the surface with{" "}
              <span className="font-medium">destructive-foreground</span>
              for primary text on critical confirmations.
            </p>
            <span
              className="mt-3 inline-flex items-center rounded border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: role("destructive"),
                borderColor: role("destructive"),
                color: role("destructive-foreground"),
              }}
              data-role="destructive-foreground"
              role="button"
              tabIndex={0}
              title="Jump to destructive-foreground role"
              onClick={(event) => {
                event.stopPropagation();
                notifyRole(event, "destructive-foreground");
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
                notifyRoleKey(event, "destructive-foreground");
              }}
            >
              Foreground sample
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
