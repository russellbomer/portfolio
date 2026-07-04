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

function isLocalDevHost(host: string) {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Static/public assets (images, pdfs, etc.) have a file extension and
  // must be served as-is — rewriting these under /datum would 404 them,
  // since /datum has no matching sub-path for e.g. /images/foo.png.
  const isStaticAsset = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (isDatumHost(host)) {
    // Next.js's app/favicon.ico file-convention icon is global — a route's
    // own metadata/icon.png gets added alongside it, not swapped in, and
    // browsers request /favicon.ico directly regardless of <link> tags. So
    // serve Datum's own mark at that exact well-known URL for this host.
    if (pathname === "/favicon.ico") {
      const url = request.nextUrl.clone();
      url.pathname = "/images/datum/datum-mark-square.png";
      return NextResponse.rewrite(url);
    }

    // Transparently serve /datum at the subdomain's root, so the address
    // bar always shows datum.russellbomer.com, never .../datum.
    if (!isStaticAsset && !pathname.startsWith("/datum")) {
      const url = request.nextUrl.clone();
      url.pathname = `/datum${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // On every other host (the main domain, preview deployments, etc.),
  // /datum should never resolve directly — send it to the subdomain.
  // Exempt local dev (localhost/127.0.0.1) so /datum is directly
  // previewable without spoofing the Host header; real traffic never
  // sends that Host, so this has no effect in production.
  if (
    !isLocalDevHost(host) &&
    (pathname === "/datum" || pathname.startsWith("/datum/"))
  ) {
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
  matcher: ["/((?!api|_next/static|_next/image).*)"],
  runtime: "nodejs",
};
