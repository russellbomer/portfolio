"use client";

import DemoErrorBoundary from "@/components/demo/DemoErrorBoundary";
import { DemoSessionProvider } from "@/components/demo/DemoSessionProvider";
import dynamic from "next/dynamic";

type Props = { demoKey: string };

const TerminalDemo = dynamic(() => import("@/components/demo/TerminalDemo"), {
  ssr: false,
});

export default function DemoMount({ demoKey }: Props) {
  switch (demoKey) {
    case "terminal":
      return (
        <DemoErrorBoundary>
          <DemoSessionProvider>
            <TerminalDemo />
          </DemoSessionProvider>
        </DemoErrorBoundary>
      );
    default:
      return <span className="text-sm">External demo</span>;
  }
}
