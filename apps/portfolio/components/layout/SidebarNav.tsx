"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

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
          font-mono text-xs uppercase tracking-widest
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
        font-mono text-xs uppercase tracking-widest flex
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

  // Scroll to section with offset to align with peak content opacity
  // Each section has 200vh scroll trigger, content at full opacity from 40-60% scroll progress
  // Scrolling to 50% of the trigger (100vh into it) centers the content at peak opacity
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

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
  };

  useEffect(() => {
    // Observer for active section tracking
    // Each section has a 200vh scroll trigger with content at full opacity from 40-60% scroll progress
    // Peak visibility center is at 50% scroll progress of each section
    // Using -40% top margin to detect slightly before geometric center
    // This aligns the nav highlight with when content "feels" most prominent
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Find the entry that's currently intersecting with highest ratio
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const best = intersecting.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActiveSection(best.target.id);
        }
      },
      {
        // Detection band: 40% from top, 59% from bottom = 1% visible zone at 40% height
        // This triggers when section is at peak-opacity scroll position
        rootMargin: "-40% 0px -59% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Check visibility based on about section position
    const checkVisibility = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Show sidebar when the center of the about section reaches the center of the viewport
        const aboutCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        setIsVisible(aboutCenter <= viewportCenter);
      }
    };

    // Initial check
    checkVisibility();

    // Listen for scroll
    window.addEventListener("scroll", checkVisibility, { passive: true });

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", checkVisibility);
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
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
          aria-label="Section navigation"
        >
          {navItems.map(({ id, label }) => {
            const isActive = activeSection === id;
            const isHovered = hoveredSection === id;
            const showLabel = isActive || isHovered;

            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                onMouseEnter={() => setHoveredSection(id)}
                onMouseLeave={() => setHoveredSection(null)}
                className="group relative flex items-center gap-3 text-left"
                aria-current={isActive ? "page" : undefined}
              >
                {/* Indicator dot */}
                <motion.span
                  className="w-2 h-2 rounded-full bg-current"
                  animate={{
                    scale: isActive ? 1.5 : 1,
                    opacity: isActive ? 1 : 0.4,
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
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
