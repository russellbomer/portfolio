import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const enabled =
    process.env.FEATURE_TERMINAL === "1" ||
    process.env.FEATURE_TERMINAL === "true";
  if (!enabled) {
    return NextResponse.json(
      { ok: false, enabled: false, reason: "Feature disabled" },
      { status: 503 }
    );
  }
  // Placeholder: WS upgrade will be implemented in the production terminal phase
  return NextResponse.json(
    { ok: false, message: "WebSocket not implemented yet" },
    { status: 501 }
  );
}
