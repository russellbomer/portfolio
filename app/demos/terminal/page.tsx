"use client";

import DemoErrorBoundary from "@/components/demo/DemoErrorBoundary";
import { DemoSessionProvider } from "@/components/demo/DemoSessionProvider";
import nextDynamic from "next/dynamic";

const TerminalDemo = nextDynamic(
  () => import("@/components/demo/TerminalDemo"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm">
          Loading terminal...
        </span>
      </div>
    ),
  }
);

export const dynamic = "force-dynamic";

export default function TerminalDemoPage() {
  return (
    <article
      id="main-content"
      className="h-[100dvh] overflow-hidden flex flex-col py-4 pl-6 pr-6 lg:pr-[420px]"
    >
      <div className="rounded-lg border border-border/50 bg-[hsl(var(--thorn))] overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/10 border-b border-border/30 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs font-mono text-muted-foreground/60">
            quarry — terminal
          </span>
        </div>
        <div className="p-4 flex-1 min-h-0 overflow-hidden">
          <DemoErrorBoundary>
            <DemoSessionProvider>
              <TerminalDemo />
            </DemoSessionProvider>
          </DemoErrorBoundary>
        </div>
      </div>
    </article>
  );
}
