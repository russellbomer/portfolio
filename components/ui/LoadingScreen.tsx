"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  /** Minimum display time in ms */
  minDuration?: number;
}

// Total time to lock scroll: loading screen + hero text animation
// Loading: 2500ms display + 1200ms fade = 3700ms
// Hero animation ends at ~9960ms from initial load
// Add small buffer for smoothness
const SCROLL_LOCK_DURATION = 10200; // ms

export function LoadingScreen({ minDuration = 2500 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Lock scroll on homepage during loading + hero animation
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    // Store original styles
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      height: document.body.style.height,
    };
    const scrollY = window.scrollY;

    // Lock scroll - comprehensive approach for mobile
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // Also prevent touchmove during lock
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });

    // Unlock after full animation sequence
    const scrollTimer = setTimeout(() => {
      // Restore original styles
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.left = originalStyle.left;
      document.body.style.right = originalStyle.right;
      document.body.style.width = originalStyle.width;
      document.body.style.height = originalStyle.height;

      // Restore scroll position
      window.scrollTo(0, scrollY);

      // Remove touch listener
      document.removeEventListener("touchmove", preventScroll);
    }, SCROLL_LOCK_DURATION);

    return () => {
      clearTimeout(scrollTimer);
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.left = originalStyle.left;
      document.body.style.right = originalStyle.right;
      document.body.style.width = originalStyle.width;
      document.body.style.height = originalStyle.height;
      window.scrollTo(0, scrollY);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [pathname]);

  // Show loading on initial mount and when navigating to home
  useEffect(() => {
    // Only show loading screen on homepage
    if (pathname !== "/") {
      queueMicrotask(() => setIsLoading(false));
      return;
    }

    // Show loading screen - use queueMicrotask to avoid synchronous setState warning
    queueMicrotask(() => setIsLoading(true));

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [pathname, minDuration]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Spinning pinwheel loader */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width={80}
              height={80}
              viewBox="0 0 250 250"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Bottom-left fin */}
              <path
                d="M125 245C125 247.761 122.761 250 120 250H12.0711C7.61654 250 5.38571 244.614 8.53553 241.464L116.464 133.536C119.614 130.386 125 132.617 125 137.071V245Z"
                fill="hsl(118 19% 41%)"
              />
              {/* Top-left fin */}
              <path
                d="M116.464 116.464C119.614 119.614 117.383 125 112.929 125H5C2.23858 125 0 122.761 0 120V12.0711C0 7.61654 5.38571 5.38571 8.53553 8.53553L116.464 116.464Z"
                fill="hsl(22 76% 36%)"
              />
              {/* Bottom-right fin */}
              <path
                d="M250 237.929C250 242.383 244.614 244.614 241.464 241.464L133.536 133.536C130.386 130.386 132.617 125 137.071 125H245C247.761 125 250 127.239 250 130V237.929Z"
                fill="hsl(22 76% 36%)"
              />
              {/* Top-right fin */}
              <path
                d="M125 5C125 2.23858 127.239 0 130 0H237.929C242.383 0 244.614 5.3857 241.464 8.53552L133.536 116.464C130.386 119.614 125 117.383 125 112.929V5Z"
                fill="hsl(118 19% 41%)"
              />
            </motion.svg>

            {/* Loading text */}
            <motion.p
              className="font-mono text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
