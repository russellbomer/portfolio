"use client";

/**
 * ContrastBadge component
 * Shows contrast ratio and pass/fail status
 */
import { contrastRatio } from "@/lib/color";
import type { Hsl } from "@/types/theme";

interface ContrastBadgeProps {
  foreground: Hsl;
  background: Hsl;
  level?: "AA" | "AAA";
  size?: "normal" | "large";
  label?: string;
}

export function ContrastBadge({
  foreground,
  background,
  level = "AA",
  size = "normal",
  label,
}: ContrastBadgeProps) {
  const ratio = contrastRatio(foreground, background);

  // Determine threshold
  let threshold: number;
  if (level === "AAA") {
    threshold = size === "large" ? 4.5 : 7.0;
  } else {
    threshold = size === "large" ? 3.0 : 4.5;
  }

  const passes = ratio >= threshold;

  return (
    <div className="inline-flex items-center gap-2 text-xs">
      {label && <span className="text-muted-foreground">{label}:</span>}
      <div
        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono ${
          passes
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        <span>{ratio.toFixed(2)}:1</span>
        <span className="text-[10px] opacity-70">
          {passes ? "✓" : "✗"} {level}
        </span>
      </div>
      {!passes && (
        <span className="text-xs text-destructive">
          Need {threshold.toFixed(1)}:1
        </span>
      )}
    </div>
  );
}
