import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const enabled =
    process.env.FEATURE_TERMINAL === "1" ||
    process.env.FEATURE_TERMINAL === "true";
  if (!enabled) {
    return NextResponse.json(
      { ok: false, enabled: false, reason: "Feature disabled" },
      { status: 503 }
    );
  }
  const wsUrl =
    process.env.NEXT_PUBLIC_TERMINAL_WS_URL ||
    process.env.TERMINAL_PUBLIC_WS_URL ||
    null;
  return NextResponse.json({ ok: true, enabled: true, wsUrl }, { status: 200 });
}
