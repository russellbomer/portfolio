"use client";

import DemoErrorBoundary from "@/components/demo/DemoErrorBoundary";
import { DemoSessionProvider } from "@/components/demo/DemoSessionProvider";
import nextDynamic from "next/dynamic";

const TerminalDemo = nextDynamic(
  () => import("@/components/demo/TerminalDemo"),
  {
    ssr: false,
  }
);

export const dynamic = "force-dynamic";

export default function FullWidthTerminalPage() {
  return (
    <section className="w-full py-6">
      <h1 className="text-2xl font-semibold mb-4">
        Terminal Demo (Full Width)
      </h1>
      <DemoErrorBoundary>
        <DemoSessionProvider>
          <TerminalDemo />
        </DemoSessionProvider>
      </DemoErrorBoundary>
    </section>
  );
}
