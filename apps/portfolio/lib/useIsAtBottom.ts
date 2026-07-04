"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has been scrolled (near) all the way to the bottom.
 * Same "near bottom" threshold BackToTop already used for its own
 * visibility, extracted so other fixed elements (which aren't otherwise
 * scroll-gated) can react to the same moment.
 */
export function useIsAtBottom({ active = true }: { active?: boolean } = {}) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    if (!active) {
      queueMicrotask(() => setIsAtBottom(false));
      return;
    }

    const check = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isScrollable = documentHeight > window.innerHeight + 50;
      const isNearBottom = scrollPosition >= documentHeight - 100;
      setIsAtBottom(isScrollable && isNearBottom);
    };

    queueMicrotask(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [active]);

  return isAtBottom;
}
