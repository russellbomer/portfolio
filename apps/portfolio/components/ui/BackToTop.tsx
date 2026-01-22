"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkIfAtBottom = () => {
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
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--rust)/0.3)] bg-background/80 backdrop-blur-sm shadow-lg hover:border-[hsl(var(--eucalyptus))] hover:bg-background transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5 text-foreground" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
