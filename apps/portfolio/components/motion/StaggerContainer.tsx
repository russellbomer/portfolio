"use client";

import {
  staggerContainer,
  staggerFast,
  staggerItem,
  staggerSlow,
  viewportOnce,
} from "@/lib/motion/variants";
import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type StaggerSpeed = "fast" | "normal" | "slow";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  /** Speed of stagger animation */
  speed?: StaggerSpeed;
  /** Whether to trigger animation when in viewport (scroll) or immediately */
  triggerOnView?: boolean;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** Custom variants (defaults to staggerItem) */
  variants?: Variants;
}

/**
 * Container that staggers the animation of its children.
 * Use with StaggerItem for proper effect.
 * Respects prefers-reduced-motion for accessibility.
 */
export function StaggerContainer({
  children,
  className,
  speed = "normal",
  triggerOnView = true,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const getVariants = (): Variants => {
    switch (speed) {
      case "fast":
        return staggerFast;
      case "slow":
        return staggerSlow;
      default:
        return staggerContainer;
    }
  };

  // If user prefers reduced motion, render without animation
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const animationProps = triggerOnView
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: viewportOnce,
      }
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
      };

  return (
    <motion.div
      className={className}
      variants={getVariants()}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item within a StaggerContainer.
 * Animates as part of the staggered sequence.
 */
export function StaggerItem({
  children,
  className,
  variants = staggerItem,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render without animation
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
