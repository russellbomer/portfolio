import { sendContactEmail } from "@/lib/email";
import { NextRequest } from "next/server";

// FUTURE: Replace console logging with email dispatch (nodemailer / external API)
// NICE: Add rate limiting + spam heuristics (captcha, content checks)

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  // Honeypot check
  if (formData.get("website")) {
    return new Response(null, { status: 204 });
  }
  const name = (formData.get("name") || "").toString();
  const email = (formData.get("email") || "").toString();
  const interest = (formData.get("interest") || "").toString();
  const message = (formData.get("message") || "").toString();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await sendContactEmail({ name, email, interest, message });
    return new Response(JSON.stringify({ ok: true, id: result.messageId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const msg = err?.message || "Email send failed";
    console.error("[contact] email send failed", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
