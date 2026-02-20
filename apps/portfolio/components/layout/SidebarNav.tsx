"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "standards", label: "Standards" },
  { id: "work", label: "Work" },
  { id: "connect", label: "Connect" },
];

// Character animation variants for typing effect
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

const characterVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface TypingLabelProps {
  text: string;
  isActive: boolean;
}

function TypingLabel({ text, isActive }: TypingLabelProps) {
  const shouldReduceMotion = useReducedMotion();
  const characters = text.split("");

  if (shouldReduceMotion) {
    return (
      <span
        className={`
          font-mono text-[10px] uppercase tracking-widest
          ${isActive ? "text-foreground" : "text-muted-foreground"}
        `}
      >
        {text}
      </span>
    );
  }

  return (
    <motion.span
      className={`
        font-mono text-[10px] uppercase tracking-widest flex
        ${isActive ? "text-foreground" : "text-muted-foreground"}
      `}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {characters.map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={characterVariants}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function SidebarNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isNavigatingRef = useRef(false);

  // Scroll to section with offset to align with peak content opacity
  // Each section has 200vh scroll trigger, content at full opacity from 40-60% scroll progress
  // Scrolling to 50% of the trigger (100vh into it) centers the content at peak opacity
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Signal other scroll helpers (e.g., center nudge) to stand down
    // while this explicit navigation scroll is in progress.
    window.dispatchEvent(new CustomEvent("section-navigation-scroll-start"));

    // Lock visibility during navigation to prevent flicker
    isNavigatingRef.current = true;
    setIsVisible(true);

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = rect.height; // 200vh typically

    // Scroll to 50% of the section's scroll trigger for peak opacity positioning
    // This places the content at the scroll position where opacity = 1
    const targetScroll =
      elementTop + elementHeight * 0.5 - window.innerHeight * 0.5;

    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: "smooth",
    });

    // Release lock after smooth scroll completes (typically ~500ms)
    setTimeout(() => { isNavigatingRef.current = false; }, 800);
  };

  useEffect(() => {
    // Track active section based on scroll position
    // Uses section element positions directly - more reliable than IntersectionObserver
    // which can conflict with spring-smoothed opacity animations
    const updateActiveSection = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestSection = "";
      let closestDistance = Infinity;

      navItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementCenter = elementTop + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = id;
        }
      });

      if (closestSection) {
        setActiveSection(closestSection);
      }
    };

    // Check visibility based on the exact About-center scroll target with hysteresis.
    // This matches scrollToSection behavior and prevents early visibility during intro.
    const checkVisibility = () => {
      // Skip visibility changes during navigation to prevent flicker
      if (isNavigatingRef.current) return;

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
      // Between thresholds: keep current state (hysteresis)
    };

    const handleScroll = () => {
      updateActiveSection();
      checkVisibility();
    };

    // Initial check
    handleScroll();

    // Listen for scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden lg:block h-56"
          aria-label="Section navigation"
        >
          {(() => {
            const activeIndex = navItems.findIndex(
              (item) => item.id === activeSection
            );

            return navItems.map(({ id, label }, index) => {
              const isActive = activeSection === id;
              const isHovered = hoveredSection === id;
              const showLabel = isActive || isHovered;
              const isCompleted = activeIndex >= 0 && index <= activeIndex;
              const position =
                navItems.length > 1
                  ? (index / (navItems.length - 1)) * 100
                  : 0;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  onMouseEnter={() => setHoveredSection(id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="group absolute left-0 -translate-y-1/2 flex items-center gap-3 text-left"
                  style={{ top: `${position}%` }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Indicator dot */}
                  <motion.span
                    className="w-2 h-2 rounded-full bg-current"
                    animate={{
                      scale: isActive ? 1.5 : 1,
                      opacity: isActive ? 1 : isCompleted ? 0.8 : 0.4,
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Typing label with AnimatePresence */}
                  <div className="min-w-[80px] h-4 flex items-center">
                    <AnimatePresence mode="wait">
                      {showLabel && (
                        <TypingLabel key={id} text={label} isActive={isActive} />
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            });
          })()}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
