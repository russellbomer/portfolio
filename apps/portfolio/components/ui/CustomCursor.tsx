"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    // Only show custom cursor on devices with fine pointer (mouse)
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    // Use queueMicrotask to avoid synchronous setState warning
    queueMicrotask(() => setHasFinePointer(finePointer));
    if (!finePointer) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handlePointerCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer";
      setIsPointer(isClickable);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousemove", handlePointerCheck);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Hide default cursor globally
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = "* { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousemove", handlePointerCheck);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      const existingStyle = document.getElementById("custom-cursor-style");
      if (existingStyle) existingStyle.remove();
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (!hasFinePointer) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isPointer ? 1.2 : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 460 460"
        fill="none"
        className="relative -top-[1px] -left-[1px]"
      >
        <path
          d="M19.5017 460C8.73121 460 -3.81725e-07 451.267 -8.52445e-07 440.498L-1.92532e-05 19.5391C-2.00125e-05 2.16699 21.006 -6.53467 33.2914 5.75138L454.249 426.707C466.535 438.993 457.833 460 440.461 460L19.5017 460Z"
          className="fill-[hsl(var(--fern))] dark:fill-[hsl(var(--rust))]"
        />
      </svg>
    </motion.div>
  );
}
