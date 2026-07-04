"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsDatumRoute } from "@/lib/isDatumRoute";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useFooterClampedOffset } from "@/lib/useFooterClampedOffset";
import { useIsAtBottom } from "@/lib/useIsAtBottom";

// Everywhere else: fixed top-left on mobile, top-right on desktop.
// On Datum below the lg breakpoint (where the header condenses and the
// parallax rails are hidden), it moves to bottom-left instead, aligned
// with BackToPortfolioBadge's bottom-right position — same row, opposite
// corners — since the header no longer has room for it there. Below lg it
// also stops scrolling with the page at the same point as that badge
// (clamped just above the footer), via the same shared hook.
const POSITION_DEFAULT = "top-6 left-6 md:left-auto md:right-6";
const POSITION_DATUM = "bottom-6 left-6 lg:top-6 lg:bottom-auto lg:left-auto lg:right-6";
const GAP_REM = 1.5; // matches bottom-6/left-6
const LG_QUERY = "(min-width: 1024px)";
// Matches BackToTop's own entrance duration, so the label fades in only
// once the equivalent button-cluster animation on this side has settled.
const LABEL_DELAY = 0.3;

const iconVariants = {
  initial: { scale: 0.6, opacity: 0, rotate: -90 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.6, opacity: 0, rotate: 90 },
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isDatumRoute = useIsDatumRoute();
  const isLgUp = useMediaQuery(LG_QUERY);
  const position = isDatumRoute ? POSITION_DATUM : POSITION_DEFAULT;
  // Scoped to the mobile/tablet 3-button row (this + BackToTop +
  // BackToPortfolioBadge); false everywhere else, so the label below never
  // renders outside that context.
  const isBottomCluster = isDatumRoute && !isLgUp;
  const isAtBottom = useIsAtBottom({ active: isBottomCluster });
  const bottomPx = useFooterClampedOffset({
    footerId: "datum-footer",
    gapRem: GAP_REM,
    active: isBottomCluster,
  });

  // On mount, read from localStorage. Light is the sitewide default when
  // nothing is stored yet (a deliberate branding choice, not an OS-preference
  // fallback) since html has no "dark" class by default in the root layout.
  useEffect(() => {
    // Use a microtask to avoid synchronous setState warning
    queueMicrotask(() => {
      setMounted(true);
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      if (stored) {
        setTheme(stored);
        document.documentElement.classList.toggle("dark", stored === "dark");
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const button = !mounted ? (
    // Prevent flash during SSR
    <div className="pointer-events-auto h-10 w-10 rounded-full bg-muted/50" />
  ) : (
    <motion.button
      onClick={toggleTheme}
      className={`pointer-events-auto h-10 w-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
        theme === "light"
          ? "bg-[hsl(var(--thorn))] border border-[hsl(var(--linen)/0.3)]"
          : "bg-[hsl(var(--linen))] border border-[hsl(var(--thorn)/0.3)]"
      }`}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="moon"
            variants={shouldReduceMotion ? undefined : iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-[hsl(var(--linen))]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            variants={shouldReduceMotion ? undefined : iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-[hsl(var(--thorn))]" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <div
      style={bottomPx !== null ? { bottom: bottomPx } : undefined}
      // Fixed + no explicit width shrink-wraps to the button (its only
      // in-flow child), so the label below — position: absolute, which
      // doesn't participate in this box's sizing — can never shift the
      // button itself when it mounts/unmounts.
      className={`pointer-events-none fixed ${position} z-50`}
    >
      {button}
      {isBottomCluster && (
        <AnimatePresence>
          {isAtBottom && (
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
              Theme
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
