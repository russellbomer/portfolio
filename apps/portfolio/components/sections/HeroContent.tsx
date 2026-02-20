"use client";

import { TypewriterText } from "@/components/motion/TypewriterText";
import { useInitialLoad } from "@/components/providers/InitialLoadProvider";
import { motion } from "framer-motion";
import { useState } from "react";

export function HeroContent() {
  const { shouldAnimate } = useInitialLoad();
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  // Timing calculation for typing effect with pauses:
  // Loading screen: ~2500ms display + 1200ms fade = 3700ms
  // Line 1: "Hello, I'm" (10 chars × 50ms = 500ms) starts at 3800ms
  // Pause: 400ms after line 1 completes
  // Line 2: "Russell Bomer" (13 chars × 50ms = 650ms) starts at 4700ms
  // Pause: 500ms after line 2 completes
  // Line 3: "I make software... and a lot of other things."
  // Each dot in the ellipsis is intentionally slower for a trailing pause effect
  // Scroll prompt fades in when tagline completes
  // NOTE: Scroll lock is handled by LoadingScreen component

  const speed = 50; // 50ms per character (original fast speed)

  const line1Start = 3800;
  const line1Duration = 10 * speed; // 500ms
  const pause1 = 400;

  const line2Start = line1Start + line1Duration + pause1; // 4700ms
  const line2Duration = 13 * speed; // 650ms
  const pause2 = 500;

  const line3Start = line2Start + line2Duration + pause2; // 5850ms
  const line3Speed = 50;
  const line3EllipsisSpeed = 320;

  // If not initial session load, show content immediately without animation
  if (!shouldAnimate) {
    return (
      <div className="max-w-4xl">
        {/* Greeting */}
        <p className="text-muted-foreground font-mono text-sm mb-3">
          Hello, I&apos;m
        </p>

        {/* Name */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
          Russell Bomer
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-6">
          I make software... and a lot of other things.
        </p>

        {/* Scroll prompt */}
        <button
          className="text-muted-foreground text-sm font-mono cursor-pointer hover:text-foreground transition-colors"
          onClick={() => {
            const element = document.getElementById("about");
            if (element) {
              const rect = element.getBoundingClientRect();
              const scrollTop = window.scrollY;
              const elementTop = rect.top + scrollTop;
              // Scroll to the point where sidebar becomes visible:
              // Sidebar appears when aboutCenter <= viewportCenter
              // aboutCenter = elementTop + height/2, viewportCenter = scrollY + vh/2
              // So we need: elementTop + height/2 = scrollY + vh/2
              // scrollY = elementTop + height/2 - vh/2
              const sectionHeight = rect.height;
              const viewportHeight = window.innerHeight;
              const targetScroll =
                elementTop + sectionHeight / 2 - viewportHeight / 2;

              window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: "smooth",
              });
            }
          }}
        >
          <span className="animate-pulse">↓ Scroll for more</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Greeting */}
      <p className="text-muted-foreground font-mono text-sm mb-3">
        <TypewriterText
          text="Hello, I'm"
          delay={line1Start}
          speed={speed}
          hideCursorOnComplete
        />
      </p>

      {/* Name */}
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
        <TypewriterText
          text="Russell Bomer"
          delay={line2Start}
          speed={speed}
          hideCursorOnComplete
        />
      </h1>

      {/* Tagline */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-6">
        <TypewriterText
          text="I make software... and a lot of other things."
          delay={line3Start}
          speed={line3Speed}
          ellipsisSpeed={line3EllipsisSpeed}
          onComplete={() => setShowScrollPrompt(true)}
        />
      </p>

      {/* Scroll prompt */}
      <motion.button
        className="text-muted-foreground text-sm font-mono cursor-pointer hover:text-foreground transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollPrompt ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        onClick={() => {
          const element = document.getElementById("about");
          if (element) {
            // Scroll to the point where sidebar becomes visible:
            // Sidebar appears when aboutCenter <= viewportCenter
            // aboutCenter = elementTop + height/2, viewportCenter = scrollY + vh/2
            // So we need: elementTop + height/2 = scrollY + vh/2
            // scrollY = elementTop + height/2 - vh/2
            const rect = element.getBoundingClientRect();
            const scrollTop = window.scrollY;
            const elementTop = rect.top + scrollTop;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;
            const targetScroll =
              elementTop + sectionHeight / 2 - viewportHeight / 2;

            window.scrollTo({
              top: Math.max(0, targetScroll),
              behavior: "smooth",
            });
          }
        }}
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓ Scroll for more
        </motion.span>
      </motion.button>
    </div>
  );
}
