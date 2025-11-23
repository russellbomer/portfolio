"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div
      className="rounded border p-3 flex items-end justify-between min-h-20"
      style={{}}
    >
      <div className={`h-10 w-10 rounded ${className}`} />
      <span className="text-xs text-muted-foreground ml-3">{label}</span>
    </div>
  );
}

function SampleButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="rounded bg-primary px-3 py-1.5 text-primary-foreground">
        Primary
      </button>
      <button className="rounded bg-secondary px-3 py-1.5 text-secondary-foreground">
        Secondary
      </button>
      <button className="rounded bg-accent px-3 py-1.5 text-accent-foreground">
        Accent
      </button>
      <button className="rounded bg-destructive px-3 py-1.5 text-destructive-foreground">
        Destructive
      </button>
      <button className="rounded px-3 py-1.5 border ring-2 ring-ring">
        Ring
      </button>
    </div>
  );
}

export default function ColorsPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark");
    else html.classList.remove("dark");
    return () => {
      html.classList.remove("dark");
    };
  }, [isDark]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Color Preview</h1>
          <p className="text-muted-foreground">
            Light and dark palette with semantic tokens.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Theme:</span>
          <button
            className="rounded border px-3 py-1.5 bg-background text-foreground"
            onClick={() => setIsDark((v) => !v)}
          >
            {isDark ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        <Swatch label="background" className="bg-background" />
        <Swatch label="foreground" className="bg-foreground" />
        <Swatch label="card" className="bg-card" />
        <Swatch label="primary" className="bg-primary" />
        <Swatch label="primary-foreground" className="bg-primary-foreground" />
        <Swatch label="secondary" className="bg-secondary" />
        <Swatch
          label="secondary-foreground"
          className="bg-secondary-foreground"
        />
        <Swatch label="accent" className="bg-accent" />
        <Swatch label="accent-foreground" className="bg-accent-foreground" />
        <Swatch label="muted" className="bg-muted" />
        <Swatch label="muted-foreground" className="bg-muted-foreground" />
        <Swatch label="destructive" className="bg-destructive" />
        <Swatch
          label="destructive-foreground"
          className="bg-destructive-foreground"
        />
        <div className="rounded border p-3">
          <div className="h-10 w-full rounded border-2 border-border" />
          <span className="text-xs text-muted-foreground">border</span>
        </div>
        <div className="rounded border p-3">
          <div className="h-10 w-full rounded ring-2 ring-ring" />
          <span className="text-xs text-muted-foreground">ring</span>
        </div>
        <Swatch label="chart-1" className="bg-chart-1" />
        <Swatch label="chart-2" className="bg-chart-2" />
        <Swatch label="chart-3" className="bg-chart-3" />
        <Swatch label="chart-4" className="bg-chart-4" />
        <Swatch label="chart-5" className="bg-chart-5" />
      </section>

      <div className="my-8 h-px bg-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Sample UI</h2>
        <div className="rounded border bg-card p-6 text-card-foreground">
          <p className="mb-3 text-sm text-muted-foreground">
            Buttons using semantic tokens
          </p>
          <SampleButtons />
        </div>
      </section>

      <footer className="mt-10 text-sm text-muted-foreground">
        <Link className="hover:underline" href="/projects">
          Back to Projects
        </Link>
      </footer>
    </main>
  );
}
