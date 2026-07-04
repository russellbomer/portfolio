"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NoiseTexture } from "@/components/ui/NoiseTexture";
import { DatumMark } from "./DatumMark";
import { useDatumLenis } from "./DatumSmoothScroll";

export function DatumHeader() {
  const lenis = useDatumLenis();

  const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!lenis) return; // reduced motion / not yet mounted: let the native jump happen
    e.preventDefault();
    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    lenis.scrollTo(id, { offset: -headerHeight - 16 });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <NoiseTexture
        className="pointer-events-none absolute inset-0 z-0"
        filterId="datum-header-roughpaper"
      />
      <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 lg:pr-20">
        <Link href="#top" onClick={(e) => scrollToAnchor(e, "#top")} className="flex items-center">
          <DatumMark variant="square" className="h-[3.515625rem] w-[3.515625rem]" priority />
        </Link>
        <nav className="flex items-center gap-4 text-xs">
          <Button
            asChild
            size="sm"
            className="inline-flex bg-[hsl(var(--rust))] text-white hover:bg-[hsl(var(--creamsicle))]"
          >
            <Link href="#contact" onClick={(e) => scrollToAnchor(e, "#contact")}>
              Start a conversation
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
