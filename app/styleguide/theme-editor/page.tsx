"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeSide = "light" | "dark";

// Tokens to edit (CSS variable names without the leading --)
const TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  "kelp",
  "heavy-metal",
];

function normalizeColor(value: string) {
  const v = value.trim();
  if (!v) return v;
  // Already a hex
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v;
  // Try rgb/rgba() to hex
  const m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    const [r, g, b] = parts;
    const toHex = (n: number) =>
      Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return v; // leave as-is (hsl, named colors) — will be used in text input
}

export default function ThemeEditorPage() {
  const [side, setSide] = useState<ThemeSide>("light");
  const [values, setValues] = useState<
    Record<ThemeSide, Record<string, string>>
  >({ light: {}, dark: {} });

  // Initialize from computed styles
  useEffect(() => {
    const html = document.documentElement;
    const getFor = (isDark: boolean) => {
      if (isDark) html.classList.add("dark");
      else html.classList.remove("dark");
      const cs = getComputedStyle(html);
      const obj: Record<string, string> = {};
      TOKENS.forEach((t) => {
        const raw = cs.getPropertyValue(`--${t}`);
        obj[t] = normalizeColor(raw);
      });
      return obj;
    };
    setValues({ light: getFor(false), dark: getFor(true) });
  }, []);

  // Apply current values to document
  useEffect(() => {
    const html = document.documentElement;
    if (side === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    const current = values[side] || {};
    Object.entries(current).forEach(([k, v]) => {
      if (v) html.style.setProperty(`--${k}`, v);
    });
    return () => {
      // no-op; keep styles applied
    };
  }, [values, side]);

  const exportJSON = () => {
    const data = JSON.stringify(values, null, 2);
    navigator.clipboard.writeText(data);
    alert("Theme JSON copied to clipboard.");
  };

  const exportCSS = () => {
    const toBlock = (obj: Record<string, string>) =>
      Object.entries(obj)
        .map(([k, v]) => `  --${k}: ${v};`)
        .join("\n");
    const css = `:root{\n${toBlock(values.light || {})}\n}\n\n.dark{\n${toBlock(
      values.dark || {}
    )}\n}`;
    navigator.clipboard.writeText(css);
    alert("CSS snippet copied to clipboard.");
  };

  const importJSON = () => {
    const text = prompt(
      "Paste theme JSON (keys: light/dark -> token -> value)"
    );
    if (!text) return;
    try {
      const obj = JSON.parse(text);
      if (obj.light && obj.dark) setValues(obj);
      else alert("Invalid JSON shape.");
    } catch (e) {
      alert("Invalid JSON.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Theme Editor</h1>
          <p className="text-muted-foreground">
            Tweak semantic tokens live. Toggle Light/Dark, then export JSON or
            CSS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={side === "light" ? "default" : "secondary"}
            onClick={() => setSide("light")}
          >
            Light
          </Button>
          <Button
            variant={side === "dark" ? "default" : "secondary"}
            onClick={() => setSide("dark")}
          >
            Dark
          </Button>
        </div>
      </header>

      <section className="mb-6 flex flex-wrap gap-2">
        <Button onClick={exportJSON}>Copy JSON</Button>
        <Button variant="secondary" onClick={exportCSS}>
          Copy CSS Snippet
        </Button>
        <Button variant="outline" onClick={importJSON}>
          Import JSON
        </Button>
        <Link className="text-sm underline" href="/styleguide/colors">
          Back to Color Preview
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOKENS.map((token) => {
          const v = values[side]?.[token] ?? "";
          return (
            <div key={`${side}:${token}`} className="rounded border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">{token}</div>
                <div className="flex items-center gap-2">
                  <input
                    aria-label={`${token} color`}
                    type="color"
                    value={/^#/.test(v) ? v : "hsl(var(--foreground))"}
                    onChange={(e) => {
                      const next = e.target.value;
                      setValues((prev) => ({
                        ...prev,
                        [side]: { ...prev[side], [token]: next },
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={v}
                  onChange={(e) => {
                    const next = e.target.value;
                    setValues((prev) => ({
                      ...prev,
                      [side]: { ...prev[side], [token]: next },
                    }));
                  }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
