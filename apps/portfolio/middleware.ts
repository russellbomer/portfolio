/**
 * Minimal middleware for portfolio site.
 * Auth-related code removed as part of Phase C cleanup.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DATUM_HOST = "datum.russellbomer.com";

function isDatumHost(host: string) {
  return host === DATUM_HOST || host.startsWith(`${DATUM_HOST}:`);
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  if (isDatumHost(host)) {
    // Transparently serve /datum at the subdomain's root, so the address
    // bar always shows datum.russellbomer.com, never .../datum.
    if (!pathname.startsWith("/datum")) {
      const url = request.nextUrl.clone();
      url.pathname = `/datum${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // On every other host (the main domain, preview deployments, etc.),
  // /datum should never resolve directly — send it to the subdomain.
  if (pathname === "/datum" || pathname.startsWith("/datum/")) {
    const url = request.nextUrl.clone();
    url.hostname = DATUM_HOST;
    url.port = "";
    url.pathname = pathname.replace(/^\/datum/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // Pass through all other requests — no auth protection needed for portfolio
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
