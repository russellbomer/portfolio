import { NextRequest } from "next/server";

// Basic in-memory store for dev inspection (not for production persistence)
const recent: Array<{ name: string; value: number; ts: number; id: string }> =
  [];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Minimal validation
    if (
      !data ||
      typeof data.name !== "string" ||
      typeof data.value !== "number"
    ) {
      return Response.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    recent.push({
      name: data.name,
      value: data.value,
      ts: Date.now(),
      id: String(data.id || "unknown"),
    });
    // Keep array bounded
    if (recent.length > 200) recent.splice(0, recent.length - 200);

    // Log in development for quick feedback
    if (process.env.NODE_ENV !== "production") {
      console.log("[Metric]", data.name, data.value, data.rating);
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: "parse" }, { status: 400 });
  }
}

// Optional: lightweight GET for local debugging
export async function GET() {
  return Response.json({ ok: true, recent });
}
