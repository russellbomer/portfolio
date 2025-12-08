"use client";

import DemoErrorBoundary from "@/components/demo/DemoErrorBoundary";
import {
  DemoSessionProvider,
  useDemoSession,
} from "@/components/demo/DemoSessionProvider";
import { FileDownloader } from "@/components/demo/FileDownloader";
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

// Derive the file API base URL from the WebSocket URL
const WS_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_TERMINAL_WS_URL as string)) ||
  "ws://127.0.0.1:4000/ws";

function getFileApiBaseUrl(): string {
  // Replace protocol first, then remove /ws path
  // Order matters: wss: must be replaced before ws: to avoid matching
  return WS_URL.replace("wss:", "https:")
    .replace("ws:", "http:")
    .replace("/ws", "");
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
      className="h-[100dvh] overflow-hidden flex flex-col py-4 px-6 lg:pr-[420px]"
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
        <div className="p-4 flex-1 min-h-0 overflow-hidden relative">
          <DemoErrorBoundary>
            <DemoSessionProvider>
              <TerminalWithFileDownloader />
            </DemoSessionProvider>
          </DemoErrorBoundary>
        </div>
        <div className="px-4 py-2 border-t border-border/30 text-xs text-white text-center">
          Powered by{" "}
          <a
            href="https://xtermjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--eucalyptus))] hover:underline"
          >
            xterm.js
          </a>
          ,{" "}
          <a
            href="https://www.docker.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--eucalyptus))] hover:underline"
          >
            Docker
          </a>
          , and{" "}
          <a
            href="https://github.com/microsoft/node-pty"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--eucalyptus))] hover:underline"
          >
            node-pty
          </a>
        </div>
      </div>
    </article>
  );
}
