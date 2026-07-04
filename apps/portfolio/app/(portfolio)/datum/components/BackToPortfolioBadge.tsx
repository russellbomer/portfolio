"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useFooterClampedOffset } from "@/lib/useFooterClampedOffset";
import { useIsAtBottom } from "@/lib/useIsAtBottom";
import { useMediaQuery } from "@/lib/useMediaQuery";

const GAP_REM = 1.5; // matches ThemeToggle's bottom-6/left-6
const LG_QUERY = "(min-width: 1024px)";
// Matches BackToTop's own entrance duration, so the label fades in only
// once the equivalent button-cluster animation on this side has settled.
const LABEL_DELAY = 0.3;

export function BackToPortfolioBadge() {
  const shouldReduceMotion = useReducedMotion();
  const isLgUp = useMediaQuery(LG_QUERY);
  // Scoped to the mobile/tablet 3-button row (ThemeToggle + BackToTop +
  // this badge), same as the other two.
  const showLabel = !isLgUp;
  const isAtBottom = useIsAtBottom({ active: showLabel });
  const bottomPx = useFooterClampedOffset({
    footerId: "datum-footer",
    gapRem: GAP_REM,
    active: true,
  });

  return (
    <div
      style={bottomPx !== null ? { bottom: bottomPx } : undefined}
      // Fixed + no explicit width shrink-wraps to the link (its only
      // in-flow child), so the label below — position: absolute, which
      // doesn't participate in this box's sizing — can never shift the
      // link itself when it mounts/unmounts.
      className="pointer-events-none fixed right-6 bottom-6 z-50"
    >
      <motion.a
        href="https://russellbomer.com/home"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group pointer-events-auto flex h-10 w-10 items-center overflow-hidden whitespace-nowrap rounded-full border border-border bg-background pl-3 shadow-lg transition-[width] duration-300 ease-out hover:w-[13.5rem] hover:border-[hsl(var(--eucalyptus))]"
        aria-label="Back to russellbomer.com"
      >
        <ArrowLeft className="h-4 w-4 shrink-0 text-foreground" />
        <span className="ml-0 text-xs text-muted-foreground opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:opacity-100">
          Back to russellbomer.com
        </span>
      </motion.a>
      <AnimatePresence>
        {showLabel && isAtBottom && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, delay: LABEL_DELAY, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            className="pointer-events-none absolute top-full left-0 right-0 mt-1.5 text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
          >
            Home
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
