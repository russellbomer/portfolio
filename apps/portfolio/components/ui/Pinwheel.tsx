"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface PinwheelProps {
  className?: string;
  size?: number;
  /** Single color for all blades */
  color?: string;
  /** Alternating colors for blades [color1, color2] - overrides color prop */
  colors?: [string, string];
  /** Rotation multiplier - higher = more rotation per scroll */
  spinSpeed?: number;
  /** Initial rotation in degrees (for intro animation) */
  initialRotation?: number;
}

export function Pinwheel({
  className = "",
  size = 64,
  color = "currentColor",
  colors,
  spinSpeed = 1,
  initialRotation = 0,
}: PinwheelProps) {
  const initialScrollRef = useRef<number | null>(null);
  const baseRotation = useMotionValue(initialRotation);

  // If colors array provided, use alternating; otherwise use single color
  const bladeColors = colors
    ? [colors[0], colors[1], colors[0], colors[1]]
    : [color, color, color, color];

  // Track global scroll
  const { scrollY } = useScroll();

  // Capture initial scroll position and update base rotation when initialRotation changes
  useEffect(() => {
    if (initialScrollRef.current === null) {
      initialScrollRef.current = window.scrollY;
    }
    baseRotation.set(initialRotation);
  }, [initialRotation, baseRotation]);

  // Calculate rotation from scroll position relative to initial
  const scrollRotation = useTransform(scrollY, (latest) => {
    const startY = initialScrollRef.current ?? 0;
    const scrolled = latest - startY;
    // 1 full rotation per 1000px scrolled
    return (scrolled / 1000) * 360 * spinSpeed;
  });

  // Combine base rotation with scroll rotation
  const totalRotation = useTransform(
    [baseRotation, scrollRotation],
    ([base, scroll]) => (base as number) + (scroll as number)
  );

  // Spring smoothing for buttery rotation
  const smoothRotation = useSpring(totalRotation, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 250 250"
      fill="none"
      className={`will-change-transform ${className}`}
      style={{
        rotate: smoothRotation,
        aspectRatio: "1 / 1",
        flexShrink: 0,
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Bottom-left blade */}
      <path
        d="M125 245C125 247.761 122.761 250 120 250H12.0711C7.61654 250 5.38571 244.614 8.53553 241.464L116.464 133.536C119.614 130.386 125 132.617 125 137.071V245Z"
        fill={bladeColors[0]}
      />
      {/* Top-left blade */}
      <path
        d="M116.464 116.464C119.614 119.614 117.383 125 112.929 125H5C2.23858 125 0 122.761 0 120V12.0711C0 7.61654 5.38571 5.38571 8.53553 8.53553L116.464 116.464Z"
        fill={bladeColors[1]}
      />
      {/* Bottom-right blade */}
      <path
        d="M250 237.929C250 242.383 244.614 244.614 241.464 241.464L133.536 133.536C130.386 130.386 132.617 125 137.071 125H245C247.761 125 250 127.239 250 130V237.929Z"
        fill={bladeColors[1]}
      />
      {/* Top-right blade */}
      <path
        d="M125 5C125 2.23858 127.239 0 130 0H237.929C242.383 0 244.614 5.3857 241.464 8.53552L133.536 116.464C130.386 119.614 125 117.383 125 112.929V5Z"
        fill={bladeColors[0]}
      />
    </motion.svg>
  );
}
