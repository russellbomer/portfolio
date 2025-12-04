"use client";

import DemoErrorBoundary from "@/components/demo/DemoErrorBoundary";
import {
  DemoSessionProvider,
  useDemoSession,
} from "@/components/demo/DemoSessionProvider";
import { FileDownloader } from "@/components/demo/FileDownloader";
import nextDynamic from "next/dynamic";
import Link from "next/link";

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

// Derive the file API base URL from the WebSocket URL
const WS_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_TERMINAL_WS_URL as string)) ||
  "ws://127.0.0.1:4000/ws";

function getFileApiBaseUrl(): string {
  return WS_URL.replace("/ws", "")
    .replace("wss:", "https:")
    .replace("ws:", "http:");
}

// Inner component that has access to session context
function TerminalWithFileDownloader() {
  const session = useDemoSession();
  const baseUrl = getFileApiBaseUrl();

  return (
    <div className="relative w-full h-full">
      <TerminalDemo />
      <FileDownloader sessionId={session.serverSessionId} baseUrl={baseUrl} />
    </div>
  );
}

export default function TerminalDemoPage() {
  return (
    <article
      id="main-content"
      className="h-[100dvh] overflow-hidden flex flex-col py-4 pl-6 pr-6 lg:pr-[420px]"
    >
      <nav className="mb-3 shrink-0">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to projects</span>
        </Link>
      </nav>

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
        <div className="p-4 flex-1 min-h-0 overflow-hidden relative">
          <DemoErrorBoundary>
            <DemoSessionProvider>
              <TerminalWithFileDownloader />
            </DemoSessionProvider>
          </DemoErrorBoundary>
        </div>
      </div>
    </article>
  );
}
