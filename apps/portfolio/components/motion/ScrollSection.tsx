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
 * The first section scrolls upward as it fades out for a parallax effect.
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
  // Timing is tuned so next section starts fading in as previous fades out
  const getOpacityConfig = () => {
    if (isFirst) {
      return {
        input: [0, 0.5, 0.65, 0.75],
        output: [1, 1, 1, 0],
      };
    }
    if (isLast) {
      // Start fading in earlier to overlap with previous section's fade out
      return {
        input: [0.15, 0.3, 0.5, 1],
        output: [0, 1, 1, 1],
      };
    }
    // Middle sections: fade in earlier, stay visible longer, fade out
    return {
      input: [0.15, 0.3, 0.6, 0.75],
      output: [0, 1, 1, 0],
    };
  };

  const { input, output } = getOpacityConfig();
  const opacity = useTransform(scrollYProgress, input, output);

  // For the first section, add upward movement as it fades out
  // This creates a parallax effect where content scrolls up faster than the page
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 0.75], // Start moving when opacity starts to fade
    [0, 0, -150] // Move up 150px as it fades out
  );

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
  // First section also moves upward as it fades for parallax effect
  // All sections use consistent 110vh for ~1 full mouse scroll rhythm
  const scrollHeight = "h-[110vh]";

  return (
    <>
      {/* Scroll trigger area - invisible spacer */}
      <div ref={ref} className={scrollHeight} id={id} />

      {/* Fixed content overlay */}
      <motion.div
        className={`fixed inset-0 flex items-center pointer-events-none ${className}`}
        style={{
          opacity,
          y: isFirst ? y : 0,
        }}
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
