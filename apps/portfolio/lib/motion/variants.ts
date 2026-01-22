/**
 * Shared animation variants for Framer Motion
 * These provide consistent timing, easing, and animation patterns across the site.
 */
import type { Variants } from "framer-motion";

// Easing curves
export const easing = {
  // Smooth, natural feel
  smooth: [0.6, 0.01, 0.05, 0.95] as const,
  // Quick start, gentle finish
  easeOut: [0.16, 1, 0.3, 1] as const,
  // Gentle start, quick finish
  easeIn: [0.4, 0, 1, 1] as const,
  // Spring-like bounce
  spring: [0.34, 1.56, 0.64, 1] as const,
};

// Duration constants (in seconds)
export const duration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  xslow: 0.8,
};

// Fade in from bottom (default section animation)
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
};

// Simple fade (no movement)
export const fade: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
};

// Scale up from center
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
};

// Stagger container - use with staggered children
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Fast stagger for nav items
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Slow stagger for hero elements
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Child variant for staggered lists
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
};

// Viewport options for scroll-triggered animations
export const viewportOnce = {
  once: true,
  amount: 0.3,
  margin: "-50px",
};

// Viewport that re-triggers on scroll
export const viewportRepeat = {
  once: false,
  amount: 0.2,
  margin: "-30px",
};
