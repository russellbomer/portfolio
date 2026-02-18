"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
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
  // Timing widened so sections stay at full opacity longer
  const getOpacityConfig = () => {
    if (isFirst) {
      return {
        input: [0, 0.5, 0.7, 0.85],
        output: [1, 1, 1, 0],
      };
    }
    if (isLast) {
      // Start fading in earlier to overlap with previous section's fade out
      return {
        input: [0.1, 0.2, 0.5, 1],
        output: [0, 1, 1, 1],
      };
    }
    // Middle sections: wider full opacity band (20-70% of scroll)
    return {
      input: [0.1, 0.2, 0.7, 0.85],
      output: [0, 1, 1, 0],
    };
  };

  const { input, output } = getOpacityConfig();
  const opacityRaw = useTransform(scrollYProgress, input, output);

  // For the first section, add upward movement as it fades out
  // This creates a parallax effect where content scrolls up faster than the page
  const yRaw = useTransform(
    scrollYProgress,
    [0, 0.6, 0.85], // Start moving when opacity starts to fade
    [0, 0, -150] // Move up 150px as it fades out
  );

  // Spring config for smooth, non-jumpy animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Smooth all transforms with springs for buttery scrolling
  const opacity = useSpring(opacityRaw, springConfig);
  const y = useSpring(yRaw, springConfig);

  // Track if section is visible enough to receive pointer events
  const [isInteractive, setIsInteractive] = useState(isFirst);

  useMotionValueEvent(opacity, "change", (latest) => {
    // Only allow interaction when opacity is above threshold
    setIsInteractive(latest > 0.3);
  });

  // Mobile or reduced motion: natural scroll with fade-in animation
  // Hero section is full-bleed (min-h-screen), others fit content with padding
  if (shouldReduceMotion || isMobile) {
    const sectionClasses = isFirst
      ? "min-h-screen flex items-center py-16"
      : "py-[25px] border-t border-[hsl(var(--rust)/0.2)]";

    // Hero section: no fade-in animation (typewriter effect is the intro animation)
    // Other sections: fade in when scrolled into view
    if (isFirst) {
      return (
        <section
          id={id}
          className={`${sectionClasses} ${className}`}
        >
          {children}
        </section>
      );
    }

    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`${sectionClasses} ${className}`}
      >
        {children}
      </motion.section>
    );
  }

  // Desktop: fixed content with scroll-driven opacity
  // First section also moves upward as it fades for parallax effect
  // Increased to 150vh for longer dwell time at full opacity
  const scrollHeight = "h-[200vh]";

  return (
    <>
      {/* Scroll trigger area - invisible spacer */}
      <div ref={ref} className={`relative ${scrollHeight}`} id={id} />

      {/* Fixed content overlay - z-10 keeps it below sidebar (z-50) */}
      <motion.div
        className={`fixed inset-0 z-10 flex items-center pointer-events-none will-change-transform ${className}`}
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
