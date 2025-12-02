"use client";

import { TypewriterText } from "@/components/motion/TypewriterText";
import { motion } from "framer-motion";

export function HeroContent() {
  // Timing calculation for typing effect with pauses:
  // Loading screen: ~2500ms display + 1200ms fade = 3700ms
  // Line 1: "Hello, I'm" (10 chars × 50ms = 500ms) starts at 3800ms
  // Pause: 400ms after line 1 completes
  // Line 2: "Russell Bomer" (13 chars × 50ms = 650ms) starts at 4700ms
  // Pause: 500ms after line 2 completes
  // Line 3a: "I make software." (16 chars × 50ms = 800ms) starts at 5850ms
  // Pause: 700ms (extra beat)
  // Line 3b: ".. and a lot of other things." (29 chars × 50ms = 1450ms) starts at 7350ms
  // Scroll prompt fades in when tagline completes

  const speed = 50; // 50ms per character (original fast speed)

  const line1Start = 3800;
  const line1Duration = 10 * speed; // 500ms
  const pause1 = 400;

  const line2Start = line1Start + line1Duration + pause1; // 4700ms
  const line2Duration = 13 * speed; // 650ms
  const pause2 = 500;

  const line3aStart = line2Start + line2Duration + pause2; // 5850ms
  const line3aDuration = 16 * speed; // 800ms
  const pause3 = 700; // extra beat

  const slowSpeed = 90; // slower speed for the second part
  const line3bStart = line3aStart + line3aDuration + pause3; // 7350ms
  const line3bDuration = 29 * slowSpeed; // 2610ms

  const scrollPromptStart = (line3bStart + line3bDuration) / 1000; // ~9.96s

  return (
    <div className="max-w-4xl">
      {/* Greeting */}
      <p className="text-muted-foreground font-mono text-sm mb-4">
        <TypewriterText
          text="Hello, I'm"
          delay={line1Start}
          speed={speed}
          hideCursorOnComplete
        />
      </p>

      {/* Name */}
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6">
        <TypewriterText
          text="Russell Bomer"
          delay={line2Start}
          speed={speed}
          hideCursorOnComplete
        />
      </h1>

      {/* Tagline */}
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
        <TypewriterText
          text="I make software."
          delay={line3aStart}
          speed={speed}
          hideCursorOnComplete
        />
        <TypewriterText
          text=".. and a lot of other things."
          delay={line3bStart}
          speed={slowSpeed}
        />
      </p>

      {/* Scroll prompt */}
      <motion.button
        className="text-muted-foreground text-sm font-mono cursor-pointer hover:text-foreground transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: scrollPromptStart, duration: 1.5 }}
        onClick={() => {
          const element = document.getElementById("about");
          if (element) {
            // ScrollSection uses a 200vh spacer, and content is fully opaque
            // at ~40% scroll progress. Scroll to 50% of the spacer to land at full opacity.
            const rect = element.getBoundingClientRect();
            const scrollTop = window.scrollY;
            const elementTop = rect.top + scrollTop;
            const targetScroll = elementTop + window.innerHeight * 0.5;

            window.scrollTo({
              top: targetScroll,
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
