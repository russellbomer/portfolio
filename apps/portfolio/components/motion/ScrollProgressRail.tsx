"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface ScrollProgressRailProps {
  sectionIds?: string[];
}

const defaultSectionIds = ["about", "standards", "work", "connect"];

export function ScrollProgressRail({ sectionIds = defaultSectionIds }: ScrollProgressRailProps) {
  const { scrollY } = useScroll();
  const [sectionAnchors, setSectionAnchors] = useState<number[]>([]);

  const mappedProgress = useTransform(scrollY, (latest) => {
    if (sectionAnchors.length < 2) {
      return 0;
    }

    const clampedAnchors = [...sectionAnchors].sort((a, b) => a - b);
    const segmentCount = clampedAnchors.length - 1;

    if (latest <= clampedAnchors[0]) return 0;
    if (latest >= clampedAnchors[segmentCount]) return 1;

    for (let i = 0; i < segmentCount; i++) {
      const left = clampedAnchors[i];
      const right = clampedAnchors[i + 1];

      if (latest >= left && latest <= right) {
        const span = right - left;
        const t = span === 0 ? 0 : (latest - left) / span;
        return i / segmentCount + t * (1 / segmentCount);
      }
    }

    return 0;
  });

  const progress = useSpring(mappedProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const computeAnchors = () => {
      const anchors = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;

          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const centerAlignedScroll =
            top + rect.height * 0.5 - window.innerHeight * 0.5;

          return Math.max(0, centerAlignedScroll);
        })
        .filter((value): value is number => value !== null);

      setSectionAnchors(anchors);
    };

    computeAnchors();
    window.addEventListener("resize", computeAnchors);

    return () => {
      window.removeEventListener("resize", computeAnchors);
    };
  }, [sectionIds]);

  useEffect(() => {
    const checkVisibility = () => {
      const aboutElement = document.getElementById("about");

      if (!aboutElement) {
        setIsVisible(false);
        return;
      }

      const rect = aboutElement.getBoundingClientRect();
      const aboutTop = rect.top + window.scrollY;
      const aboutHeight = rect.height;

      if (aboutHeight <= 0) {
        setIsVisible(false);
        return;
      }

      const showAtScrollY =
        aboutTop + aboutHeight * 0.5 - window.innerHeight * 0.5;
      const hysteresis = 80;

      if (window.scrollY >= showAtScrollY) {
        setIsVisible(true);
      } else if (window.scrollY < showAtScrollY - hysteresis) {
        setIsVisible(false);
      }
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-center pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="relative h-56 w-px bg-border/40 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 bg-foreground/80"
          style={{
            height: "100%",
            scaleY: progress,
            transformOrigin: "top",
          }}
        />

        {sectionIds.map((id, index) => {
          const position = sectionIds.length > 1 ? index / (sectionIds.length - 1) : 0;

          return (
          <span
            key={`${id}-${index}`}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-px bg-muted-foreground/70"
            style={{ top: `${position * 100}%` }}
            title={id}
          />
          );
        })}
      </div>
    </div>
  );
}
