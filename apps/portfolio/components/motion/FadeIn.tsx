"use client";

import {
  duration,
  easing,
  fade,
  fadeInLeft,
  fadeInRight,
  fadeInUp,
} from "@/lib/motion/variants";
import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Direction to fade in from */
  direction?: Direction;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of animation (in seconds) */
  animationDuration?: number;
}

/**
 * Generic fade-in wrapper with directional options.
 * Respects prefers-reduced-motion for accessibility.
 */
export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  animationDuration = duration.normal,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  // Get the appropriate variant based on direction
  const getVariants = (): Variants => {
    switch (direction) {
      case "up":
        return fadeInUp;
      case "down":
        return {
          hidden: { opacity: 0, y: -24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: animationDuration, ease: easing.smooth },
          },
        };
      case "left":
        return fadeInLeft;
      case "right":
        return fadeInRight;
      case "none":
      default:
        return fade;
    }
  };

  // If user prefers reduced motion, render without animation
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={getVariants()}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
