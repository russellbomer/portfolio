"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const GAP_PX = 24; // matches ThemeToggle's top-6

// Floats fixed at `GAP_PX` from the viewport bottom (tracking scroll like
// ThemeToggle tracks the top) until the footer's top edge approaches,
// then clamps so it settles `GAP_PX` above the footer instead of
// overlapping it. position: sticky can't do this on its own here: with
// only `bottom` set, a sticky element deep at the end of a long parent
// only engages right as its natural position reaches the container's end,
// giving it no floating range beforehand.
export function BackToPortfolioBadge() {
  const shouldReduceMotion = useReducedMotion();
  const [bottomPx, setBottomPx] = useState(GAP_PX);

  useEffect(() => {
    const footer = document.getElementById("datum-footer");
    if (!footer) return;

    const updatePosition = () => {
      const footerTopDocY = footer.getBoundingClientRect().top + window.scrollY;
      const viewportBottomDocY = window.scrollY + window.innerHeight;
      const overshoot = Math.max(0, viewportBottomDocY - footerTopDocY);
      setBottomPx(GAP_PX + overshoot);
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <motion.a
      href="https://russellbomer.com"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ bottom: bottomPx }}
      className="group fixed right-6 z-50 flex h-10 w-10 items-center overflow-hidden whitespace-nowrap rounded-full border border-border bg-background/80 pl-3 shadow-lg backdrop-blur-sm transition-[width] duration-300 ease-out hover:w-[13.5rem] hover:border-[hsl(var(--eucalyptus))]"
      aria-label="Back to russellbomer.com"
    >
      <ArrowLeft className="h-4 w-4 shrink-0 text-foreground" />
      <span className="ml-0 text-xs text-muted-foreground opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:opacity-100">
        Back to russellbomer.com
      </span>
    </motion.a>
  );
}
