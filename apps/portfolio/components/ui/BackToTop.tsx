"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { datumLenisHolder } from "@/lib/datumLenis";
import { useIsDatumRoute } from "@/lib/isDatumRoute";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useFooterClampedOffset } from "@/lib/useFooterClampedOffset";

// Only show BackToTop on these routes
const ALLOWED_ROUTES = ["/", "/home", "/datum"];
const GAP_REM = 1.5; // matches ThemeToggle/BackToPortfolioBadge's bottom-6
const LG_QUERY = "(min-width: 1024px)";
// Below-button labels only fade in once the page has been scrolled to the
// bottom (isVisible already implies that), and only after this button's own
// entrance animation (duration 0.3) has finished.
const LABEL_DELAY = 0.3;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isAllowedRoute = ALLOWED_ROUTES.includes(pathname);
  const isDatumRoute = useIsDatumRoute();
  const isLgUp = useMediaQuery(LG_QUERY);
  // On Datum below lg, this sits centered between ThemeToggle (left) and
  // BackToPortfolioBadge (right), at the same clamped-above-footer height
  // as both of them, rather than its usual bottom-4/centered-at-md spot.
  // The under-button label is scoped to this same 3-button row.
  const isDatumCentered = isDatumRoute && !isLgUp;
  const bottomPx = useFooterClampedOffset({
    footerId: "datum-footer",
    gapRem: GAP_REM,
    active: isDatumCentered,
  });

  useEffect(() => {
    const checkIfAtBottom = () => {
      // Only check visibility on allowed routes
      if (!isAllowedRoute) {
        setIsVisible(false);
        return;
      }
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      // Only show if page is scrollable AND near bottom
      const isScrollable = documentHeight > window.innerHeight + 50;
      const isNearBottom = scrollPosition >= documentHeight - 100;
      setIsVisible(isScrollable && isNearBottom);
    };

    // Initial check
    checkIfAtBottom();

    window.addEventListener("scroll", checkIfAtBottom, { passive: true });
    return () => window.removeEventListener("scroll", checkIfAtBottom);
  }, [isAllowedRoute]);

  const scrollToTop = () => {
    // On /datum, Lenis owns the scroll animation loop — a native
    // window.scrollTo here would fight it (Lenis keeps interpolating
    // toward its own stored target, causing a visible snap-back).
    if (datumLenisHolder.current) {
      datumLenisHolder.current.scrollTo(0);
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    // Always mounted (unlike the old isVisible-gated wrapper) so bottomPx
    // — computed here, not inside the AnimatePresence below — never resets
    // and recomputes from scratch. It previously remounted every time
    // isVisible flickered near its threshold (easy with Lenis's eased
    // scroll settling), replaying the button's slide-up entrance and
    // making the label appear to "track" upward with further scrolling
    // instead of staying put once it first appeared.
    <div
      style={bottomPx !== null ? { bottom: bottomPx } : undefined}
      className={`pointer-events-none fixed z-50 ${
        isDatumCentered
          ? "left-1/2 -translate-x-1/2"
          : "bottom-4 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2"
      }`}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={scrollToTop}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-lg hover:border-[hsl(var(--eucalyptus))] transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4 text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
      {isDatumCentered && (
        <AnimatePresence>
          {isVisible && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, delay: LABEL_DELAY, ease: [0.16, 1, 0.3, 1] },
              }}
              // No delay on exit: this shares the button's own exit (which
              // has none), so they fade out together instead of the label
              // lagging behind by LABEL_DELAY.
              exit={{ opacity: 0, y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              className="pointer-events-none absolute top-full left-0 right-0 mt-1.5 text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
            >
              Top
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
