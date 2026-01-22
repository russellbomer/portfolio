"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const iconVariants = {
  initial: { scale: 0.6, opacity: 0, rotate: -90 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.6, opacity: 0, rotate: 90 },
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // On mount, read from localStorage or system preference
  useEffect(() => {
    // Use a microtask to avoid synchronous setState warning
    queueMicrotask(() => {
      setMounted(true);
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      if (stored) {
        setTheme(stored);
        document.documentElement.classList.toggle("dark", stored === "dark");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setTheme(prefersDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Prevent flash during SSR
  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-muted/50" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
        theme === "light"
          ? "bg-[hsl(var(--thorn))] border border-[hsl(var(--linen)/0.3)]"
          : "bg-[hsl(var(--linen))] border border-[hsl(var(--thorn)/0.3)]"
      }`}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="moon"
            variants={shouldReduceMotion ? undefined : iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-[hsl(var(--linen))]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            variants={shouldReduceMotion ? undefined : iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-[hsl(var(--thorn))]" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
