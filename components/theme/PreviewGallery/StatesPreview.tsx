"use client";

/**
 * Feedback & status preview
 * Highlights success, warning, info, error, focus, active, disabled, and brand tokens
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SemanticRole } from "@/types/theme";
import type { KeyboardEvent, MouseEvent } from "react";

const role = (token: string) => `hsl(var(--${token}))`;

interface FeedbackPreviewProps {
  onRoleActivate?: (role: SemanticRole) => void;
}

const toneCards: Array<{
  id: "success" | "warning" | "info" | "error";
  title: string;
  body: string;
}> = [
  {
    id: "success",
    title: "Deploy pipeline healthy",
    body: "+12% conversion from last week",
  },
  {
    id: "warning",
    title: "Contrast budget nearly exceeded",
    body: "Revisit sidebar tokens before launch week.",
  },
  {
    id: "info",
    title: "New feedback in Theme Lab",
    body: "4 new suggestions awaiting triage.",
  },
  {
    id: "error",
    title: "Regression detected",
    body: "Modal overlay opacity mismatched in dark scheme.",
  },
];

export function FeedbackPreview({ onRoleActivate }: FeedbackPreviewProps) {
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
      <section>
        <h3 className="mb-4 text-lg font-semibold">Status Alerts</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {toneCards.map((card) => (
            <article
              key={card.id}
              className="rounded-lg border p-4 shadow-sm"
              style={{
                backgroundColor: role(`${card.id}-muted`),
                borderColor: role(`${card.id}-border`),
                color: role(`${card.id}-foreground`),
              }}
              data-role={`${card.id}-muted`}
              role="button"
              tabIndex={0}
              title={`Jump to ${card.id} roles`}
              onClick={(event) => notifyRole(event, `${card.id}-muted`)}
              onKeyDown={(event) => notifyRoleKey(event, `${card.id}-muted`)}
            >
              <p
                className="cursor-pointer text-sm font-semibold"
                {...interactiveProps(
                  `${card.id}-foreground` as SemanticRole,
                  "Jump to feedback foreground role"
                )}
              >
                {card.title}
              </p>
              <p
                className="cursor-pointer text-xs opacity-90"
                {...interactiveProps(
                  `${card.id}-foreground` as SemanticRole,
                  "Jump to feedback foreground role"
                )}
              >
                {card.body}
              </p>
              <span
                className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wide"
                style={{
                  backgroundColor: role(card.id),
                  color: role(`${card.id}-foreground`),
                }}
              >
                {card.id}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "surface-muted-foreground",
            "Jump to surface-muted-foreground role"
          )}
        >
          Focus & Active Rings
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: role("surface-muted"),
              borderColor: role("divider"),
              color: role("surface-muted-foreground"),
            }}
            data-role="focus-ring"
            role="button"
            tabIndex={0}
            title="Jump to focus-ring role"
            onClick={(event) => notifyRole(event, "focus-ring")}
            onKeyDown={(event) => notifyRoleKey(event, "focus-ring")}
          >
            <h4
              className="cursor-pointer text-sm font-semibold"
              {...interactiveProps(
                "surface-muted-foreground",
                "Jump to surface-muted-foreground role"
              )}
            >
              Focus outline
            </h4>
            <p
              className="mt-1 cursor-pointer text-xs opacity-80"
              {...interactiveProps(
                "surface-muted-foreground",
                "Jump to surface-muted-foreground role"
              )}
            >
              Inputs and buttons reference <code>focus-ring</code> for keyboard
              affordances.
            </p>
            <Input
              placeholder="Focus to preview"
              className="mt-3"
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
                boxShadow: `0 0 0 0 ${role("focus-ring")}`,
              }}
              onClick={(event) => notifyRole(event, "focus-ring")}
              onKeyDown={(event) => notifyRoleKey(event, "focus-ring")}
            />
          </div>

          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: role("surface-overlay"),
              borderColor: role("divider"),
              color: role("surface-overlay-foreground"),
            }}
            data-role="active-ring"
            role="button"
            tabIndex={0}
            title="Jump to active-ring role"
            onClick={(event) => notifyRole(event, "active-ring")}
            onKeyDown={(event) => notifyRoleKey(event, "active-ring")}
          >
            <h4
              className="cursor-pointer text-sm font-semibold"
              {...interactiveProps(
                "surface-overlay-foreground",
                "Jump to surface-overlay-foreground role"
              )}
            >
              Active ring
            </h4>
            <p
              className="mt-1 cursor-pointer text-xs opacity-80"
              {...interactiveProps(
                "surface-overlay-foreground",
                "Jump to surface-overlay-foreground role"
              )}
            >
              Pressed states rely on <code>active-ring</code> to reinforce
              selection.
            </p>
            <Button
              className="mt-3 w-full"
              style={{
                backgroundColor: role("accent"),
                color: role("accent-foreground"),
                borderColor: role("active-ring"),
              }}
              onClick={(event) => notifyRole(event, "active-ring")}
              onKeyDown={(event) => notifyRoleKey(event, "active-ring")}
            >
              Active state
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "surface-default-foreground",
            "Jump to surface-default-foreground role"
          )}
        >
          Disabled Feedback
        </h3>
        <div
          className="flex flex-wrap gap-3 rounded-lg border p-4"
          style={{
            backgroundColor: role("surface-default"),
            borderColor: role("divider"),
            color: role("surface-default-foreground"),
          }}
        >
          <Button
            disabled
            style={{
              backgroundColor: role("disabled-background"),
              color: role("disabled-foreground"),
              borderColor: role("divider"),
            }}
            data-role="disabled-background"
            onClick={(event) => notifyRole(event, "disabled-background")}
            onKeyDown={(event) => notifyRoleKey(event, "disabled-background")}
          >
            Disabled button
          </Button>
          <Button
            variant="outline"
            disabled
            style={{
              backgroundColor: role("disabled-background"),
              color: role("disabled-foreground"),
              borderColor: role("disabled-foreground"),
            }}
            data-role="disabled-background"
            onClick={(event) => notifyRole(event, "disabled-background")}
            onKeyDown={(event) => notifyRoleKey(event, "disabled-background")}
          >
            Outline disabled
          </Button>
          <Input
            placeholder="Disabled input"
            disabled
            style={{
              backgroundColor: role("disabled-background"),
              color: role("disabled-foreground"),
              borderColor: role("divider"),
            }}
            data-role="disabled-background"
            onClick={(event) => notifyRole(event, "disabled-background")}
            onKeyDown={(event) => notifyRoleKey(event, "disabled-background")}
          />
        </div>
      </section>

      <section>
        <h3
          className="mb-4 cursor-pointer text-lg font-semibold"
          {...interactiveProps(
            "surface-default-foreground",
            "Jump to surface-default-foreground role"
          )}
        >
          Brand Signifiers
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { role: "brand-primary", label: "Brand primary" },
            { role: "brand-secondary", label: "Brand secondary" },
            { role: "brand-tertiary", label: "Brand tertiary" },
          ].map(({ role: token, label }) => (
            <div
              key={token}
              className="rounded-lg border p-4 text-center text-sm font-semibold"
              style={{
                backgroundColor: role(token),
                color: role("surface-default-foreground"),
                borderColor: role("page-border"),
              }}
              data-role={token}
              role="button"
              tabIndex={0}
              title={`Jump to ${token} role`}
              onClick={(event) => notifyRole(event, token as SemanticRole)}
              onKeyDown={(event) => notifyRoleKey(event, token as SemanticRole)}
            >
              <span
                className="cursor-pointer"
                {...interactiveProps(
                  "surface-default-foreground",
                  "Jump to surface-default-foreground role"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
