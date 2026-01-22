/**
 * Minimal middleware for portfolio site.
 * Auth-related code removed as part of Phase C cleanup.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(_request: NextRequest) {
  // Pass through all requests — no auth protection needed for portfolio
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
