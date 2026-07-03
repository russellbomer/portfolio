"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useIsDatumRoute } from "@/lib/isDatumRoute";
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
  const isDatumRoute = useIsDatumRoute();
  const skipAnimation =
    pathname === "/" ||
    pathname === "/home" ||
    pathname === "/demos/sbfcc_pbi" ||
    pathname === "/work/sbfcc_pbi" ||
    // The scroll-linked transform this wrapper applies breaks position:
    // sticky/fixed for descendants (a transformed ancestor creates a new
    // containing block), which Datum's sticky header and back-to-portfolio
    // badge rely on. Checked via hostname too since usePathname() reports
    // "/" (not "/datum") on the datum.russellbomer.com subdomain, where
    // middleware rewrites the root internally.
    isDatumRoute ||
    shouldReduceMotion;

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
