"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

function ComponentsPreview() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>
            Inputs reflect focus, ring, and invalid states.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" />
          </div>
          <div className="grid gap-3">
            <Label>Preference</Label>
            <RadioGroup defaultValue="a">
              <div className="flex items-center gap-2">
                <RadioGroupItem id="a" value="a" />
                <Label htmlFor="a">Option A</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="b" value="b" />
                <Label htmlFor="b">Option B</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>States & Surfaces</CardTitle>
          <CardDescription>Semantic tokens across surfaces.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>RB</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">Avatar</div>
              <div className="text-muted-foreground">Uses muted background</div>
            </div>
          </div>

          <div className="rounded border bg-muted p-3 text-sm">
            Muted surface using <code>bg-muted</code> and{" "}
            <code>text-foreground</code>.
          </div>

          <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Destructive intent styled with <code>text-destructive</code> and a
            soft background.
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
              Secondary badge
            </span>
            <span className="rounded bg-accent px-2 py-1 text-accent-foreground">
              Accent badge
            </span>
            <span className="rounded bg-primary px-2 py-1 text-primary-foreground">
              Primary badge
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-muted-foreground">Card footer</span>
            <Button variant="outline">Action</Button>
          </div>
        </CardFooter>
      </Card>
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
        {/* Reserve extra tokens for future theme JSON */}
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

      <div className="my-8 h-px bg-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Components Preview</h2>
        <ComponentsPreview />
      </section>

      <footer className="mt-10 text-sm text-muted-foreground">
        <Link className="hover:underline" href="/projects">
          Back to Projects
        </Link>
      </footer>
    </main>
  );
}
