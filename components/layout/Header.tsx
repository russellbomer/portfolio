"use client";

import ThemeToggle from "@/components/theme/ThemeToggle";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-6 md:px-10 lg:px-16 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        >
          Russell Bomer
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/projects"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            Projects
          </Link>
          <Link
            href="/demos"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            Demos
          </Link>
          <Link
            href="/contact"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="w-full px-6 md:px-10 lg:px-16 py-3 flex flex-col gap-2 text-sm">
            <Link
              href="/projects"
              className="hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/demos"
              className="hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setOpen(false)}
            >
              Demos
            </Link>
            <Link
              href="/contact"
              className="hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
