"use client";

import { useEffect, useState } from "react";

interface UseFooterClampedOffsetOptions {
  /** id of the footer element to stop above */
  footerId: string;
  /** gap to maintain, in rem, converted using the actual root font size */
  gapRem: number;
  /** when false, returns null so callers can fall back to static CSS positioning */
  active: boolean;
}

/**
 * Bottom offset (px) that floats an element at `gapRem` above the viewport
 * bottom while scrolling, then clamps so it settles `gapRem` above the
 * named footer element instead of overlapping it once the page catches up.
 *
 * position: sticky can't do this alone: with only `bottom` set, a sticky
 * element deep at the end of a long parent only engages right as its
 * natural position reaches the container's end, giving it no floating
 * range beforehand — see BackToPortfolioBadge and ThemeToggle, the two
 * current callers.
 *
 * Returns null while inactive (or before the footer element/root font size
 * can be measured), so callers should treat null as "use static CSS
 * positioning instead."
 */
export function useFooterClampedOffset({
  footerId,
  gapRem,
  active,
}: UseFooterClampedOffsetOptions): number | null {
  const [bottomPx, setBottomPx] = useState<number | null>(null);

  useEffect(() => {
    if (!active) {
      queueMicrotask(() => setBottomPx(null));
      return;
    }

    const footer = document.getElementById(footerId);
    if (!footer) return;

    const update = () => {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const gapPx = gapRem * rootFontSize;
      const footerTopDocY = footer.getBoundingClientRect().top + window.scrollY;
      const viewportBottomDocY = window.scrollY + window.innerHeight;
      const overshoot = Math.max(0, viewportBottomDocY - footerTopDocY);
      // Rounded, and only committed if actually different: Lenis eases
      // scrollY toward its target with tiny sub-pixel deltas even once
      // visually settled at the bottom, and re-rendering on every one of
      // those ticks reads as jittery "springiness" even though nothing
      // here uses spring physics — it's just needless sub-pixel churn.
      const next = Math.round(gapPx + overshoot);
      setBottomPx((prev) => (prev === next ? prev : next));
    };

    queueMicrotask(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active, footerId, gapRem]);

  return bottomPx;
}
