"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** If true, section starts fully visible (for hero/first section) */
  isFirst?: boolean;
  /** If true, section stays visible after fading in (for last section) */
  isLast?: boolean;
}

/**
 * A full-viewport section that fades in/out based on scroll position.
 * Content is fixed in the viewport center, only opacity changes.
 */
export function ScrollSection({
  children,
  className = "",
  id,
  isFirst = false,
  isLast = false,
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // First section: start fully visible, only fade out
  // Last section: fade in, stay visible (no fade out)
  // Other sections: fade in, stay visible, fade out
  const getOpacityConfig = () => {
    if (isFirst) {
      return {
        input: [0, 0.5, 0.65, 0.75],
        output: [1, 1, 1, 0],
      };
    }
    if (isLast) {
      return {
        input: [0.25, 0.4, 0.6, 1],
        output: [0, 1, 1, 1],
      };
    }
    return {
      input: [0.25, 0.4, 0.6, 0.75],
      output: [0, 1, 1, 0],
    };
  };

  const { input, output } = getOpacityConfig();
  const opacity = useTransform(scrollYProgress, input, output);

  // Track if section is visible enough to receive pointer events
  const [isInteractive, setIsInteractive] = useState(isFirst);

  useMotionValueEvent(opacity, "change", (latest) => {
    // Only allow interaction when opacity is above threshold
    setIsInteractive(latest > 0.3);
  });

  // Mobile or reduced motion: natural scroll with fade-in animation
  if (shouldReduceMotion || isMobile) {
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`min-h-screen flex items-center py-16 ${
          !isFirst ? "border-t border-[hsl(var(--rust)/0.2)]" : ""
        } ${className}`}
      >
        {children}
      </motion.section>
    );
  }

  // Desktop: fixed content with scroll-driven opacity
  return (
    <>
      {/* Scroll trigger area - invisible spacer */}
      <div ref={ref} className="h-[200vh]" id={id} />

      {/* Fixed content overlay */}
      <motion.div
        className={`fixed inset-0 flex items-center pointer-events-none ${className}`}
        style={{ opacity }}
      >
        <div
          className={`w-full ${
            isInteractive ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
