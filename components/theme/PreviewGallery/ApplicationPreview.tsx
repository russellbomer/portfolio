"use client";

import { Button } from "@/components/ui/button";

const role = (token: string) => `hsl(var(--${token}))`;

const navItems = [
  { label: "Overview", active: true },
  { label: "Projects", active: false },
  { label: "Timeline", active: false },
  { label: "Team", active: false },
  { label: "Settings", active: false },
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

const alerts = [
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

const tones: Record<
  string,
  { background: string; border: string; foreground: string; subtle: string }
> = {
  success: {
    background: role("success-muted"),
    border: role("success-border"),
    foreground: role("success-foreground"),
    subtle: role("success"),
  },
  warning: {
    background: role("warning-muted"),
    border: role("warning-border"),
    foreground: role("warning-foreground"),
    subtle: role("warning"),
  },
  info: {
    background: role("info-muted"),
    border: role("info-border"),
    foreground: role("info-foreground"),
    subtle: role("info"),
  },
  error: {
    background: role("error-muted"),
    border: role("error-border"),
    foreground: role("error-foreground"),
    subtle: role("error"),
  },
};

const chartRoles = [
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

export function ApplicationPreview() {
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
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: role("nav-link-muted") }}
            >
              Portfolio Admin
            </p>
            <h2 className="text-xl font-semibold">Launch Control Center</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label="Search"
              className="h-9 rounded-md border px-3 text-sm"
              placeholder="Search projects"
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="border"
              style={{
                borderColor: role("header-border"),
                color: role("header-foreground"),
              }}
            >
              Invite team
            </Button>
            <div
              className="h-9 w-9 rounded-full border"
              style={{
                backgroundColor: role("avatar-background"),
                color: role("avatar-foreground"),
                borderColor: role("avatar-ring"),
              }}
            >
              <span className="flex h-full items-center justify-center text-sm font-semibold">
                RB
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          <aside
            className="flex w-full flex-col gap-2 border-b p-4 text-sm md:w-56 md:border-b-0 md:border-r"
            style={{
              backgroundColor: role("sidebar-background"),
              color: role("sidebar-foreground"),
              borderColor: role("sidebar-border"),
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                className="rounded-md px-3 py-2 text-left transition-colors hover:bg-[hsl(var(--nav-link-hover))] hover:text-[hsl(var(--nav-link-active))]"
                style={{
                  backgroundColor: item.active
                    ? role("sidebar-active")
                    : "transparent",
                  color: item.active
                    ? role("nav-link-active")
                    : role("nav-link"),
                  borderColor: role("sidebar-border"),
                }}
              >
                {item.label}
              </button>
            ))}

            <div
              className="mt-4 rounded-md p-3 text-xs"
              style={{
                backgroundColor: role("testimonial-background"),
                color: role("testimonial-foreground"),
              }}
            >
              <p className="font-semibold">Tip</p>
              <p className="mt-1">
                Map `sidebar` and `nav` roles to keep navigation legible.
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
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p
                    className="text-sm uppercase tracking-wide"
                    style={{ color: role("hero-accent") }}
                  >
                    Release readiness
                  </p>
                  <h3 className="text-2xl font-semibold">
                    Theme lab reporting
                  </h3>
                  <p className="mt-2 max-w-xl text-sm opacity-90">
                    Exercise all semantic roles quickly with this composed view
                    of headers, tables, alerts, charts, and interactive
                    surfaces.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: role("cta-background"),
                      color: role("cta-foreground"),
                      border: `1px solid ${role("cta-border")}`,
                    }}
                  >
                    Publish palette
                  </button>
                  <button
                    className="rounded-md px-4 py-2 text-sm"
                    style={{
                      backgroundColor: role("hero-accent"),
                      color: role("hero-accent-foreground"),
                    }}
                  >
                    Preview banner
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div
                className="rounded-lg border p-4 shadow-sm"
                style={{
                  backgroundColor: role("metrics-background"),
                  color: role("metrics-foreground"),
                  borderColor: role("page-border"),
                }}
              >
                <p className="text-xs uppercase tracking-wide">Bounce rate</p>
                <p className="mt-2 text-2xl font-semibold">31%</p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: role("metric-positive") }}
                >
                  +18% WoW
                </p>
              </div>
              <div
                className="rounded-lg border p-4 shadow-sm"
                style={{
                  backgroundColor: role("metrics-background"),
                  color: role("metrics-foreground"),
                  borderColor: role("page-border"),
                }}
              >
                <p className="text-xs uppercase tracking-wide">Open tickets</p>
                <p className="mt-2 text-2xl font-semibold">7</p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: role("metric-negative") }}
                >
                  -2 outstanding SLAs
                </p>
              </div>
              <div
                className="rounded-lg border p-4 shadow-sm"
                style={{
                  backgroundColor: role("metrics-background"),
                  color: role("metrics-foreground"),
                  borderColor: role("page-border"),
                }}
              >
                <p className="text-xs uppercase tracking-wide">QA coverage</p>
                <p className="mt-2 text-2xl font-semibold">94%</p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: role("metric-positive") }}
                >
                  Stable for 6 days
                </p>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
              <section
                className="overflow-hidden rounded-lg border shadow-sm"
                style={{
                  backgroundColor: role("timeline-background"),
                  color: role("timeline-foreground"),
                  borderColor: role("timeline-connector"),
                }}
              >
                <div
                  className="border-b px-4 py-3"
                  style={{
                    borderColor: role("timeline-connector"),
                  }}
                >
                  <h4 className="text-sm font-semibold">Runbook timeline</h4>
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
                      />
                      <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: role("timeline-connector") }}
                      >
                        {item.time}
                      </p>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs opacity-80">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                {alerts.map((alert) => {
                  const tone = tones[alert.tone];
                  return (
                    <div
                      key={alert.title}
                      className="rounded-lg border p-4 shadow-xs"
                      style={{
                        backgroundColor: tone.background,
                        borderColor: tone.border,
                        color: tone.foreground,
                      }}
                    >
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <p className="text-xs opacity-90">{alert.body}</p>
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
                >
                  <p className="text-xs font-semibold uppercase">Active tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: role("tag-active"),
                        borderColor: role("tag-border"),
                        color: role("tag-foreground"),
                      }}
                    >
                      launch-critical
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-xs"
                      style={{ borderColor: role("tag-border") }}
                    >
                      accessibility
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-xs"
                      style={{ borderColor: role("tag-border") }}
                    >
                      tokens
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-xs"
                      style={{ borderColor: role("tag-border") }}
                    >
                      docs
                    </span>
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
                >
                  <tr>
                    <th
                      className="border-b px-3 py-2 text-xs"
                      style={{ borderColor: role("page-border") }}
                    >
                      Project
                    </th>
                    <th
                      className="border-b px-3 py-2 text-xs"
                      style={{ borderColor: role("page-border") }}
                    >
                      Status
                    </th>
                    <th
                      className="border-b px-3 py-2 text-xs"
                      style={{ borderColor: role("page-border") }}
                    >
                      Owner
                    </th>
                    <th
                      className="border-b px-3 py-2 text-xs text-right"
                      style={{ borderColor: role("page-border") }}
                    >
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => {
                    const isAlt = index % 2 === 1;
                    return (
                      <tr
                        key={row.name}
                        style={{
                          backgroundColor: isAlt
                            ? role("table-row-alt")
                            : role("table-row"),
                          color: isAlt
                            ? role("table-row-alt-foreground")
                            : role("table-row-foreground"),
                        }}
                      >
                        <td
                          className="border-b px-3 py-2 text-sm"
                          style={{ borderColor: role("page-border") }}
                        >
                          {row.name}
                        </td>
                        <td
                          className="border-b px-3 py-2 text-sm"
                          style={{ borderColor: role("page-border") }}
                        >
                          {row.status}
                        </td>
                        <td
                          className="border-b px-3 py-2 text-sm"
                          style={{ borderColor: role("page-border") }}
                        >
                          {row.owner}
                        </td>
                        <td
                          className="border-b px-3 py-2 text-sm text-right"
                          style={{
                            borderColor: role("page-border"),
                            color: role("link"),
                          }}
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
                    <span style={{ color: role("terminal-prompt") }}>➜</span>{" "}
                    npm run lint
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: role("terminal-cursor") }}
                  >
                    ✔ Theme checks passed in 4.2s
                  </p>
                  <p>
                    <span style={{ color: role("terminal-prompt") }}>➜</span>{" "}
                    npm run test:ui
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: role("terminal-cursor") }}
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
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: "hsl(var(--overlay-backdrop) / 0.3)",
                    }}
                  />
                  <div className="relative space-y-2">
                    <h4 className="text-sm font-semibold">Modal preview</h4>
                    <p className="text-xs opacity-90">
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
                      >
                        Confirm
                      </button>
                      <button
                        className="rounded-md px-3 py-1 text-xs"
                        style={{
                          backgroundColor: role("subtle-background"),
                          color: role("subtle-foreground"),
                        }}
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
                >
                  <p className="text-xs font-semibold uppercase">
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
                        />
                        <span
                          className="text-[10px] uppercase tracking-wide"
                          style={{ color: role("chart-axis") }}
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
      >
        <h4 className="text-sm font-semibold">Code block</h4>
        <pre
          className="mt-3 overflow-x-auto rounded-md border p-3"
          style={{
            borderColor: role("divider"),
            backgroundColor: role("code-background"),
            color: role("code-accent"),
          }}
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
