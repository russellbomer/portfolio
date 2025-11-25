"use client";

import { useMemo, useState } from "react";

export function ProjectFilter({
  allTags,
  onChange,
}: {
  allTags: string[];
  onChange: (active: string[]) => void;
}) {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (tag: string) => {
    const next = active.includes(tag)
      ? active.filter((t) => t !== tag)
      : [...active, tag];
    setActive(next);
    onChange(next);
  };

  const hasActive = active.length > 0;
  const sorted = useMemo(() => allTags.slice().sort(), [allTags]);

  return (
    <div className="mb-6">
      <div className="mb-2 text-sm text-muted-foreground">Filter by tags</div>
      <div className="flex flex-wrap gap-2">
        {sorted.map((t) => {
          const isOn = active.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(t)}
              className={`rounded px-2 py-1 text-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isOn
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {t}
            </button>
          );
        })}
        {hasActive && (
          <button
            type="button"
            onClick={() => {
              setActive([]);
              onChange([]);
            }}
            className="rounded px-2 py-1 text-sm border bg-accent text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
