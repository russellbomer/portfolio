"use client";

import { Button } from "@/components/ui/button";
import type { SemanticRole } from "@/types/theme";
import type { KeyboardEvent, MouseEvent } from "react";

const role = (token: string) => `hsl(var(--${token}))`;

type StatusTone = "success" | "warning" | "info" | "error";

const navItems: Array<{ label: string; role: SemanticRole; active?: boolean }> =
  [
    { label: "Overview", role: "nav-link-active", active: true },
    { label: "Projects", role: "nav-link" },
    { label: "Timeline", role: "nav-link" },
    { label: "Team", role: "nav-link" },
    { label: "Settings", role: "nav-link" },
  ];

const quickFilters: Array<{ label: string; role: SemanticRole }> = [
  { label: "Dark mode ready", role: "tag-active" },
  { label: "A11y review", role: "tag-background" },
  { label: "Tokens", role: "tag-background" },
];

const timelineItems = [
  {
    title: "Design system review",
    time: "09:30",
    description: "Audit color contrast for new dashboard widgets.",
  },
  {
    title: "Marketing sync",
    time: "11:15",
    description: "Finalize hero imagery and CTA copy for launch.",
  },
  {
    title: "Customer call",
    time: "14:00",
    description: "Walk through theme customization with enterprise admin.",
  },
];

const alerts: Array<{ tone: StatusTone; title: string; body: string }> = [
  {
    tone: "success",
    title: "Deploy pipeline healthy",
    body: "+12% conversion from last week",
  },
  {
    tone: "warning",
    title: "Contrast budget nearly exceeded",
    body: "Revisit sidebar tokens before launch week.",
  },
  {
    tone: "info",
    title: "New feedback in Theme Lab",
    body: "4 new suggestions awaiting triage.",
  },
  {
    tone: "error",
    title: "Regression detected",
    body: "Modal overlay opacity mismatched in dark scheme.",
  },
];

const tableRows = [
  {
    name: "Atlas Redesign",
    status: "In Review",
    owner: "Sasha",
    progress: "68%",
  },
  { name: "Billing Upgrade", status: "Blocked", owner: "Liu", progress: "24%" },
  {
    name: "AI Assistant",
    status: "In Flight",
    owner: "Morgan",
    progress: "92%",
  },
  { name: "Docs Refresh", status: "Planned", owner: "Riley", progress: "15%" },
];

const chartRoles: SemanticRole[] = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  "chart-8",
  "chart-accent",
];

const tones: Record<
  StatusTone,
  { background: string; border: string; foreground: string; accent: string }
> = {
  success: {
    background: role("success-muted"),
    border: role("success-border"),
    foreground: role("success-foreground"),
    accent: role("success"),
  },
  warning: {
    background: role("warning-muted"),
    border: role("warning-border"),
    foreground: role("warning-foreground"),
    accent: role("warning"),
  },
  info: {
    background: role("info-muted"),
    border: role("info-border"),
    foreground: role("info-foreground"),
    accent: role("info"),
  },
  error: {
    background: role("error-muted"),
    border: role("error-border"),
    foreground: role("error-foreground"),
    accent: role("error"),
  },
};

interface ApplicationPreviewProps {
  onRoleActivate?: (role: SemanticRole) => void;
}

export function ApplicationPreview({
  onRoleActivate,
}: ApplicationPreviewProps) {
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
      event.stopPropagation();
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
    <div className="space-y-6 text-sm">
      <section
        className="overflow-hidden rounded-lg border shadow-sm"
        style={{
          backgroundColor: role("surface-default"),
          color: role("surface-default-foreground"),
          borderColor: role("page-border"),
        }}
      >
        <header
          className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3"
          style={{
            backgroundColor: role("header-background"),
            color: role("header-foreground"),
            borderColor: role("header-border"),
          }}
          {...interactiveProps("header-background", "Jump to header roles")}
        >
          <div>
            <p
              className="cursor-pointer text-xs font-semibold uppercase tracking-wide"
              style={{ color: role("nav-link-muted") }}
              {...interactiveProps(
                "nav-link-muted",
                "Jump to nav-link-muted role"
              )}
            >
              Portfolio Admin
            </p>
            <h2
              className="cursor-pointer text-xl font-semibold"
              {...interactiveProps(
                "header-foreground",
                "Jump to header-foreground role"
              )}
            >
              Launch Control Center
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label="Search"
              className="h-9 rounded-md border px-3 text-sm outline-none"
              placeholder="Search projects"
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
              }}
              data-role="input-background"
              onClick={(event) => notifyRole(event, "input-background")}
              onKeyDown={(event) => notifyRoleKey(event, "input-background")}
            />
            <Button
              size="sm"
              variant="outline"
              className="border"
              style={{
                borderColor: role("header-border"),
                color: role("header-foreground"),
              }}
              data-role="header-active"
              onClick={(event) => notifyRole(event, "header-active")}
              onKeyDown={(event) => notifyRoleKey(event, "header-active")}
            >
              Invite team
            </Button>
            <div
              className="hidden h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold md:flex"
              style={{
                backgroundColor: role("avatar-background"),
                color: role("avatar-foreground"),
                borderColor: role("avatar-ring"),
              }}
              {...interactiveProps("avatar-background", "Jump to avatar roles")}
            >
              RB
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          <aside
            className="flex w-full flex-col gap-3 border-b p-4 text-sm md:w-60 md:border-b-0 md:border-r"
            style={{
              backgroundColor: role("sidebar-background"),
              color: role("sidebar-foreground"),
              borderColor: role("sidebar-border"),
            }}
            {...interactiveProps("sidebar-background", "Jump to sidebar roles")}
          >
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full rounded-md px-3 py-2 text-left transition-colors"
                  style={{
                    backgroundColor: item.active
                      ? role("sidebar-active")
                      : "transparent",
                    color: item.active
                      ? role("nav-link-active")
                      : role(item.role),
                  }}
                  data-role={item.active ? "nav-link-active" : item.role}
                  onClick={(event) => notifyRole(event, item.role)}
                  onKeyDown={(event) => notifyRoleKey(event, item.role)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Quick filters
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <span
                    key={filter.label}
                    className="rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor:
                        filter.role === "tag-active"
                          ? role("tag-active")
                          : role("tag-background"),
                      color: role("tag-foreground"),
                      borderColor: role("tag-border"),
                    }}
                    data-role={filter.role}
                    onClick={(event) => notifyRole(event, filter.role)}
                    onKeyDown={(event) => notifyRoleKey(event, filter.role)}
                    role="button"
                    tabIndex={0}
                    title="Jump to tag roles"
                  >
                    {filter.label}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="rounded-md p-3 text-xs"
              style={{
                backgroundColor: role("testimonial-background"),
                color: role("testimonial-foreground"),
              }}
              {...interactiveProps(
                "testimonial-background",
                "Jump to testimonial roles"
              )}
            >
              <p
                className="cursor-pointer font-semibold"
                {...interactiveProps(
                  "testimonial-foreground",
                  "Jump to testimonial-foreground role"
                )}
              >
                Tip
              </p>
              <p
                className="mt-1 cursor-pointer text-[11px] leading-snug"
                {...interactiveProps(
                  "testimonial-foreground",
                  "Jump to testimonial-foreground role"
                )}
              >
                Map navigation roles early so your header, sidebar, and footer
                stay legible across schemes.
              </p>
            </div>
          </aside>

          <main
            className="flex-1 space-y-6 p-6"
            style={{
              backgroundColor: role("surface-default"),
              color: role("surface-default-foreground"),
            }}
          >
            <section
              className="rounded-lg border p-6 shadow-sm"
              style={{
                backgroundColor: role("hero-background"),
                color: role("hero-foreground"),
                borderColor: role("page-border"),
              }}
              {...interactiveProps("hero-background", "Jump to hero roles")}
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: role("hero-accent") }}
                    {...interactiveProps(
                      "hero-accent",
                      "Jump to hero accent role"
                    )}
                  >
                    Release readiness
                  </span>
                  <h3
                    className="mt-2 cursor-pointer text-2xl font-semibold"
                    {...interactiveProps(
                      "hero-foreground",
                      "Jump to hero-foreground role"
                    )}
                  >
                    Theme lab reporting
                  </h3>
                  <p
                    className="mt-2 max-w-xl cursor-pointer text-sm opacity-90"
                    {...interactiveProps(
                      "hero-foreground",
                      "Jump to hero-foreground role"
                    )}
                  >
                    Exercise semantic roles quickly with composed previews for
                    navigation, feature callouts, and media-heavy layouts.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    className="border"
                    style={{
                      backgroundColor: role("cta-background"),
                      color: role("cta-foreground"),
                      borderColor: role("cta-border"),
                    }}
                    data-role="cta-background"
                    onClick={(event) => notifyRole(event, "cta-background")}
                    onKeyDown={(event) =>
                      notifyRoleKey(event, "cta-background")
                    }
                  >
                    Publish palette
                  </Button>
                  <Button
                    variant="ghost"
                    style={{
                      backgroundColor: role("hero-accent"),
                      color: role("hero-accent-foreground"),
                    }}
                    data-role="hero-accent"
                    onClick={(event) => notifyRole(event, "hero-accent")}
                    onKeyDown={(event) => notifyRoleKey(event, "hero-accent")}
                  >
                    Preview banner
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  label: "Bounce rate",
                  value: "31%",
                  detail: "+18% WoW",
                  role: "metric-positive" as SemanticRole,
                },
                {
                  label: "Open tickets",
                  value: "7",
                  detail: "-2 outstanding SLAs",
                  role: "metric-negative" as SemanticRole,
                },
                {
                  label: "QA coverage",
                  value: "94%",
                  detail: "Stable for 6 days",
                  role: "metric-positive" as SemanticRole,
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border p-4 shadow-sm"
                  style={{
                    backgroundColor: role("metrics-background"),
                    color: role("metrics-foreground"),
                    borderColor: role("page-border"),
                  }}
                  {...interactiveProps(
                    "metrics-background",
                    "Jump to metrics roles"
                  )}
                >
                  <p
                    className="cursor-pointer text-xs uppercase tracking-wide"
                    {...interactiveProps(
                      "metrics-foreground",
                      "Jump to metrics-foreground role"
                    )}
                  >
                    {metric.label}
                  </p>
                  <p
                    className="mt-2 cursor-pointer text-2xl font-semibold"
                    {...interactiveProps(
                      "metrics-foreground",
                      "Jump to metrics-foreground role"
                    )}
                  >
                    {metric.value}
                  </p>
                  <p
                    className="mt-1 cursor-pointer text-xs"
                    style={{ color: role(metric.role) }}
                    data-role={metric.role}
                    onClick={(event) => notifyRole(event, metric.role)}
                    onKeyDown={(event) => notifyRoleKey(event, metric.role)}
                    role="button"
                    tabIndex={0}
                    title="Jump to metric roles"
                  >
                    {metric.detail}
                  </p>
                </div>
              ))}
            </section>

            <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
              <section
                className="overflow-hidden rounded-lg border shadow-sm"
                style={{
                  backgroundColor: role("timeline-background"),
                  color: role("timeline-foreground"),
                  borderColor: role("timeline-connector"),
                }}
                {...interactiveProps(
                  "timeline-background",
                  "Jump to timeline roles"
                )}
              >
                <div
                  className="border-b px-4 py-3"
                  style={{
                    borderColor: role("timeline-connector"),
                  }}
                >
                  <h4
                    className="cursor-pointer text-sm font-semibold"
                    {...interactiveProps(
                      "timeline-foreground",
                      "Jump to timeline-foreground role"
                    )}
                  >
                    Runbook timeline
                  </h4>
                </div>
                <ul className="space-y-4 px-4 py-4">
                  {timelineItems.map((item) => (
                    <li key={item.title} className="relative pl-6">
                      <span
                        className="absolute left-0 top-1 size-3 rounded-full"
                        style={{
                          backgroundColor: role("timeline-marker"),
                          boxShadow: `0 0 0 2px ${role("timeline-connector")}`,
                        }}
                        {...interactiveProps(
                          "timeline-marker",
                          "Jump to timeline marker role"
                        )}
                      />
                      <p
                        className="cursor-pointer text-xs uppercase tracking-wide"
                        style={{ color: role("timeline-connector") }}
                        {...interactiveProps(
                          "timeline-connector",
                          "Jump to timeline-connector role"
                        )}
                      >
                        {item.time}
                      </p>
                      <p
                        className="cursor-pointer text-sm font-semibold"
                        {...interactiveProps(
                          "timeline-foreground",
                          "Jump to timeline-foreground role"
                        )}
                      >
                        {item.title}
                      </p>
                      <p
                        className="cursor-pointer text-xs opacity-80"
                        {...interactiveProps(
                          "timeline-foreground",
                          "Jump to timeline-foreground role"
                        )}
                      >
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                {alerts.map((alert) => {
                  const tone = tones[alert.tone];
                  const foregroundRole =
                    `${alert.tone}-foreground` as SemanticRole;
                  return (
                    <div
                      key={alert.title}
                      className="rounded-lg border p-4 shadow-sm"
                      style={{
                        backgroundColor: tone.background,
                        borderColor: tone.border,
                        color: tone.foreground,
                      }}
                      {...interactiveProps(
                        `${alert.tone}-muted` as SemanticRole,
                        "Jump to feedback roles"
                      )}
                    >
                      <p
                        className="cursor-pointer text-sm font-semibold"
                        {...interactiveProps(
                          foregroundRole,
                          "Jump to feedback foreground role"
                        )}
                      >
                        {alert.title}
                      </p>
                      <p
                        className="cursor-pointer text-xs opacity-90"
                        {...interactiveProps(
                          foregroundRole,
                          "Jump to feedback foreground role"
                        )}
                      >
                        {alert.body}
                      </p>
                      <span
                        className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wide"
                        style={{
                          backgroundColor: tone.accent,
                          color: tone.foreground,
                        }}
                        data-role={alert.tone as SemanticRole}
                        onClick={(event) =>
                          notifyRole(event, alert.tone as SemanticRole)
                        }
                        onKeyDown={(event) =>
                          notifyRoleKey(event, alert.tone as SemanticRole)
                        }
                      >
                        {alert.tone}
                      </span>
                    </div>
                  );
                })}

                <div
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: role("tag-background"),
                    borderColor: role("tag-border"),
                    color: role("tag-foreground"),
                  }}
                  {...interactiveProps("tag-background", "Jump to tag roles")}
                >
                  <p
                    className="cursor-pointer text-xs font-semibold uppercase"
                    {...interactiveProps(
                      "tag-foreground",
                      "Jump to tag-foreground role"
                    )}
                  >
                    Active tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["launch-critical", "accessibility", "tokens", "docs"].map(
                      (tag, index) => {
                        const semanticRole =
                          index === 0 ? "tag-active" : "tag-background";
                        return (
                          <span
                            key={tag}
                            className="rounded-full border px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: role(semanticRole),
                              borderColor: role("tag-border"),
                              color: role("tag-foreground"),
                            }}
                            data-role={semanticRole}
                            onClick={(event) =>
                              notifyRole(event, semanticRole as SemanticRole)
                            }
                            onKeyDown={(event) =>
                              notifyRoleKey(event, semanticRole as SemanticRole)
                            }
                            role="button"
                            tabIndex={0}
                            title="Jump to tag roles"
                          >
                            {tag}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              </section>
            </div>

            <section
              className="overflow-hidden rounded-lg border"
              style={{
                borderColor: role("page-border"),
              }}
            >
              <table className="w-full border-collapse text-left">
                <thead
                  style={{
                    backgroundColor: role("table-header"),
                    color: role("table-header-foreground"),
                  }}
                  {...interactiveProps(
                    "table-header",
                    "Jump to table header roles"
                  )}
                >
                  <tr>
                    {["Project", "Status", "Owner", "Progress"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="border-b px-3 py-2 text-xs"
                          style={{ borderColor: role("page-border") }}
                          {...interactiveProps(
                            "table-header-foreground",
                            "Jump to table header foreground role"
                          )}
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => {
                    const isAlt = index % 2 === 1;
                    const rowRole = isAlt
                      ? ("table-row-alt" as SemanticRole)
                      : ("table-row" as SemanticRole);
                    return (
                      <tr
                        key={row.name}
                        style={{
                          backgroundColor: role(rowRole),
                          color: role(
                            isAlt
                              ? "table-row-alt-foreground"
                              : "table-row-foreground"
                          ),
                        }}
                        data-role={rowRole}
                        onClick={(event) => notifyRole(event, rowRole)}
                        onKeyDown={(event) => notifyRoleKey(event, rowRole)}
                      >
                        {([row.name, row.status, row.owner] as const).map(
                          (value, cellIndex) => {
                            const foregroundRole = (
                              isAlt
                                ? "table-row-alt-foreground"
                                : "table-row-foreground"
                            ) as SemanticRole;
                            return (
                              <td
                                key={`${row.name}-${cellIndex}`}
                                className="border-b px-3 py-2 text-sm"
                                style={{ borderColor: role("page-border") }}
                              >
                                <span
                                  className="cursor-pointer"
                                  {...interactiveProps(
                                    foregroundRole,
                                    "Jump to table row foreground role"
                                  )}
                                >
                                  {value}
                                </span>
                              </td>
                            );
                          }
                        )}
                        <td
                          className="border-b px-3 py-2 text-sm text-right"
                          style={{
                            borderColor: role("page-border"),
                            color: role("link"),
                          }}
                          data-role="link"
                          onClick={(event) => notifyRole(event, "link")}
                          onKeyDown={(event) => notifyRoleKey(event, "link")}
                        >
                          {row.progress}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <section
                className="rounded-lg border p-0 font-mono text-xs"
                style={{
                  backgroundColor: role("terminal-background"),
                  color: role("terminal-foreground"),
                  borderColor: role("terminal-foreground"),
                }}
                {...interactiveProps(
                  "terminal-background",
                  "Jump to terminal roles"
                )}
              >
                <div
                  className="border-b px-4 py-2"
                  style={{
                    borderColor: role("terminal-foreground"),
                    color: role("terminal-prompt"),
                  }}
                >
                  remote shell · build pipeline
                </div>
                <div className="space-y-1 px-4 py-4">
                  <p>
                    <span
                      style={{ color: role("terminal-prompt") }}
                      {...interactiveProps(
                        "terminal-prompt",
                        "Jump to terminal prompt role"
                      )}
                    >
                      ➜
                    </span>{" "}
                    <span
                      className="cursor-pointer"
                      {...interactiveProps(
                        "terminal-foreground",
                        "Jump to terminal-foreground role"
                      )}
                    >
                      npm run lint
                    </span>
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    style={{ color: role("terminal-cursor") }}
                    {...interactiveProps(
                      "terminal-cursor",
                      "Jump to terminal-cursor role"
                    )}
                  >
                    ✔ Theme checks passed in 4.2s
                  </p>
                  <p>
                    <span
                      style={{ color: role("terminal-prompt") }}
                      {...interactiveProps(
                        "terminal-prompt",
                        "Jump to terminal prompt role"
                      )}
                    >
                      ➜
                    </span>{" "}
                    <span
                      className="cursor-pointer"
                      {...interactiveProps(
                        "terminal-foreground",
                        "Jump to terminal-foreground role"
                      )}
                    >
                      npm run test:ui
                    </span>
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    style={{ color: role("terminal-cursor") }}
                    {...interactiveProps(
                      "terminal-cursor",
                      "Jump to terminal-cursor role"
                    )}
                  >
                    24 suites · 178 snapshots updated
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <div
                  className="relative overflow-hidden rounded-lg border p-4"
                  style={{
                    backgroundColor: role("modal-background"),
                    borderColor: role("modal-border"),
                    color: role("modal-foreground"),
                  }}
                  {...interactiveProps(
                    "modal-background",
                    "Jump to modal roles"
                  )}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: "hsl(var(--overlay-backdrop) / 0.3)",
                    }}
                    {...interactiveProps(
                      "overlay-backdrop",
                      "Jump to overlay backdrop role"
                    )}
                  />
                  <div className="relative space-y-2">
                    <h4
                      className="cursor-pointer text-sm font-semibold"
                      {...interactiveProps(
                        "modal-foreground",
                        "Jump to modal-foreground role"
                      )}
                    >
                      Modal preview
                    </h4>
                    <p
                      className="cursor-pointer text-xs opacity-90"
                      {...interactiveProps(
                        "modal-foreground",
                        "Jump to modal-foreground role"
                      )}
                    >
                      Overlay and surface roles ensure dialogs work for both
                      schemes.
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="rounded-md px-3 py-1 text-xs"
                        style={{
                          backgroundColor: role("cta-background"),
                          color: role("cta-foreground"),
                          border: `1px solid ${role("cta-border")}`,
                        }}
                        data-role="cta-background"
                        onClick={(event) => notifyRole(event, "cta-background")}
                        onKeyDown={(event) =>
                          notifyRoleKey(event, "cta-background")
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="rounded-md px-3 py-1 text-xs"
                        style={{
                          backgroundColor: role("subtle-background"),
                          color: role("subtle-foreground"),
                        }}
                        data-role="subtle-background"
                        onClick={(event) =>
                          notifyRole(event, "subtle-background")
                        }
                        onKeyDown={(event) =>
                          notifyRoleKey(event, "subtle-background")
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: role("surface-muted"),
                    borderColor: role("page-border"),
                    color: role("surface-muted-foreground"),
                  }}
                  {...interactiveProps(
                    "surface-muted",
                    "Jump to chart palette roles"
                  )}
                >
                  <p
                    className="cursor-pointer text-xs font-semibold uppercase"
                    {...interactiveProps(
                      "surface-muted-foreground",
                      "Jump to surface-muted-foreground role"
                    )}
                  >
                    Chart palette
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {chartRoles.map((chartRole) => (
                      <div
                        key={chartRole}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className="size-10 rounded-full border"
                          style={{
                            backgroundColor: role(chartRole),
                            borderColor: role("chart-grid"),
                          }}
                          data-role={chartRole}
                          onClick={(event) =>
                            notifyRole(event, chartRole as SemanticRole)
                          }
                          onKeyDown={(event) =>
                            notifyRoleKey(event, chartRole as SemanticRole)
                          }
                          role="button"
                          tabIndex={0}
                          title="Jump to chart role"
                        />
                        <span
                          className="text-[10px] uppercase tracking-wide"
                          style={{ color: role("chart-axis") }}
                          {...interactiveProps(
                            "chart-axis",
                            "Jump to chart axis role"
                          )}
                        >
                          {chartRole}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </section>

      <section
        className="rounded-lg border p-4"
        style={{
          backgroundColor: role("code-background"),
          borderColor: role("code-border"),
          color: role("code-foreground"),
        }}
        {...interactiveProps("code-background", "Jump to code roles")}
      >
        <h4
          className="cursor-pointer text-sm font-semibold"
          {...interactiveProps(
            "code-foreground",
            "Jump to code-foreground role"
          )}
        >
          Code block
        </h4>
        <pre
          className="mt-3 overflow-x-auto rounded-md border p-3"
          style={{
            borderColor: role("divider"),
            backgroundColor: role("code-background"),
            color: role("code-accent"),
          }}
          {...interactiveProps("code-accent", "Jump to code-accent role")}
        >
          {`const palette = buildPalette(tokens);
const issues = auditSemanticRoles(palette);

if (issues.length === 0) {
  console.info("Ready to ship");
}`}
        </pre>
      </section>
    </div>
  );
}
