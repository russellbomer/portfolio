import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NoiseTexture } from "@/components/ui/NoiseTexture";
import { DatumMark } from "./DatumMark";

export function DatumHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <NoiseTexture
        className="pointer-events-none absolute inset-0 z-0"
        filterId="datum-header-roughpaper"
      />
      <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 md:pr-20">
        <Link href="#top" className="flex items-center">
          <DatumMark variant="square" className="h-[3.515625rem] w-[3.515625rem]" priority />
        </Link>
        <nav className="flex items-center gap-4 text-xs">
          <Button
            asChild
            size="sm"
            className="hidden bg-[hsl(var(--rust))] text-white hover:bg-[hsl(var(--creamsicle))] sm:inline-flex"
          >
            <Link href="#contact">Start a conversation</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
