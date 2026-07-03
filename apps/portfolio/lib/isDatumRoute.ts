"use client";

import { usePathname } from "next/navigation";

const DATUM_HOST = "datum.russellbomer.com";

/**
 * True when the current page is Datum content, whether reached via the
 * direct /datum path (local dev) or the datum.russellbomer.com subdomain
 * (production, via middleware rewrite).
 *
 * usePathname() alone isn't enough: middleware's NextResponse.rewrite()
 * changes which route Next.js renders, but the browser's address bar (and
 * therefore usePathname()) still reports the original requested path — "/"
 * on the subdomain, not "/datum". Checking window.location.hostname too
 * covers that case.
 */
export function useIsDatumRoute() {
  const pathname = usePathname();

  if (pathname?.startsWith("/datum")) {
    return true;
  }

  if (typeof window !== "undefined" && window.location.hostname === DATUM_HOST) {
    return true;
  }

  return false;
}
