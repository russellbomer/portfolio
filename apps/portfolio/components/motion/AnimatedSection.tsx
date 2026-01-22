"use client";

import { fadeInUp, viewportOnce } from "@/lib/motion/variants";
import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  /** HTML element to render */
  as?: "section" | "div" | "article" | "aside";
  /** Section ID for navigation anchors */
  id?: string;
  /** Delay before animation starts (in seconds) */
  delay?: number;
}

/**
 * Scroll-triggered section reveal animation.
 * Respects prefers-reduced-motion for accessibility.
 */
export function AnimatedSection({
  children,
  className,
  variants = fadeInUp,
  as = "section",
  id,
  delay = 0,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];

  // If user prefers reduced motion, render without animation
  if (shouldReduceMotion) {
    const StaticComponent = as;
    return (
      <StaticComponent id={id} className={className}>
        {children}
      </StaticComponent>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
