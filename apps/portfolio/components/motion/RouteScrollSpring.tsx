"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface RouteScrollSpringProps {
  children: ReactNode;
}

/**
 * Applies landing-style scroll/spring smoothing to non-home routes.
 * Home route keeps its dedicated section-based animation system.
 */
export function RouteScrollSpring({ children }: RouteScrollSpringProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const skipAnimation = pathname === "/" || pathname === "/home" || shouldReduceMotion;

  const { scrollYProgress } = useScroll();

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Start fully visible at scroll top; only add subtle easing near page bottom
  const opacityRaw = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.92]);
  const yRaw = useTransform(scrollYProgress, [0, 0.9, 1], [0, 0, -8]);

  const opacity = useSpring(opacityRaw, springConfig);
  const y = useSpring(yRaw, springConfig);

  if (skipAnimation) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div style={{ opacity, y }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
