// OUTOFSCOPE: Auth-protected routes in MVP (1.2) — keep behind FUTURE milestone
// CONSTRAINT: Plan subdomain routing for demos; MVP does not require HA/scaling
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // Portfolio MVP has no auth-protected routes. Middleware reserved for
  // future subdomain routing or lightweight request instrumentation.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
