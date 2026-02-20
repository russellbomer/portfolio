"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const aboutContent = [
  "Writing a couple paragraphs to sum myself up is a difficult task; I'm still pretty young but I have a rich and varied professional history—running kitchens, coordinating supply chains for large-scale manufacturing, leading enterprise software implementation— but none of these alone really illustrate the breadth of my experience or clarify the common threads underlying my work.",
  "If I had to put it simply: I solve problems. To elaborate: I immerse myself in a situation, identify weaknesses, and find solutions. I value process, clarity, and continuous refinement; coincidentally, I value creativity, resourcefulness, and experimentation just as highly. These traits guide me in work and the rest of my life.",
  "Recently, I've been working frequently on solution architecture and engineering, automation, data analysis and visualization, and AI/ML integrations that run the gamut of my interests. I use modern web development frameworks and tools— JavaScript/TypeScript, Python, React, and Docker, for example— but I like to say I'm stack agnostic. I also enjoy working with Linux-based systems, shell scripting, the list goes on. The point is that I am adaptable and choose my tools based on the problem rather than the reverse.",
  "At home, I do woodworking, DIY projects, and maintain a homelab. I suffer Cleveland Browns football religiously, take lawn care more seriously than I probably should, and still cook regularly. There are clear throughlines between my hobbies and work: I like building things and making systems work better. As for the Browns, the throughline is that no matter how difficult something is, I am devoted to seeing it through.",
  "I'm permanently located in rural western North Carolina with my wife, 2 dogs, and 2 cats (not to mention a lot of pet fish). I'm in the process of finishing my M.S. in Software Engineering at WGU. I'm open to work and would love to discuss the ways I can help you solve a problem, so drop me a line and I'll get back to you promptly!",
];

interface ScrollLinkedAboutProps {
  className?: string;
}

/**
 * About section with scroll-linked content.
 * On desktop: page scroll controls both the section fade AND the inner content position.
 * The section has an extended scroll zone - fade in, content scrolls, fade out.
 * On mobile: standard flowing text layout.
 */
export function ScrollLinkedAbout({ className = "" }: ScrollLinkedAboutProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [contentScrollRange, setContentScrollRange] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Measure content to calculate scroll range
  useEffect(() => {
    if (!contentRef.current || isMobile) return;

    const measureContent = () => {
      const content = contentRef.current;
      if (!content) return;

      // Container visible height vs total content height
      const containerHeight = 400; // Fixed container height (matches lg:h-[400px])
      const totalHeight = content.scrollHeight;
      const scrollRange = Math.max(0, totalHeight - containerHeight);
      setContentScrollRange(scrollRange);
    };

    measureContent();
    window.addEventListener("resize", measureContent);
    return () => window.removeEventListener("resize", measureContent);
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"],
  });

  // Spring config for smooth animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Extended About scroll phases (lengthened transitions throughout):
  // 0.08 - 0.24: Fade in from intro
  // 0.24 - 0.50: Full opacity, outer About (pre-inner-content dwell)
  // 0.50 - 0.74: Full opacity, inner content scrolls
  // 0.74 - 0.92: Full opacity, back on outer About (post-scroll dwell)
  // 0.92 - 0.995: Fade out into Standards
  const opacityRaw = useTransform(
    scrollYProgress,
    [0.08, 0.24, 0.92, 0.995],
    [0, 1, 1, 0]
  );
  const opacity = useSpring(opacityRaw, springConfig);

  // Content Y position: delayed start at 0.42 (after reading time buffer)
  const contentYRaw = useTransform(
    scrollYProgress,
    [0.5, 0.74],
    [0, -contentScrollRange]
  );

  // Smooth the content movement with a spring for less jumpy scrolling
  const contentY = useSpring(contentYRaw, springConfig);

  // Scroll progress indicator (0-100% during content phase)
  const scrollIndicator = useTransform(
    scrollYProgress,
    [0.5, 0.74],
    [0, 100]
  );

  const [indicatorPercent, setIndicatorPercent] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);

  useMotionValueEvent(scrollIndicator, "change", (latest) => {
    setIndicatorPercent(Math.round(Math.min(100, Math.max(0, latest))));
  });

  useMotionValueEvent(opacity, "change", (latest) => {
    setIsInteractive(latest > 0.3);
  });

  // Mobile or reduced motion: simple flowing layout
  if (shouldReduceMotion || isMobile) {
    return (
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`py-[25px] border-t border-[hsl(var(--rust)/0.2)] ${className}`}
      >
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-3">
            About
          </h2>
          <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
            {aboutContent.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  // Desktop: scroll-linked content with extended scroll zone
  return (
    <>
      {/* Extended scroll trigger for longer intro/About/content/Standards transitions */}
      <div ref={triggerRef} className="relative h-[420vh]" id="about" />

      {/* Fixed content overlay */}
      <motion.div
        className={`fixed inset-0 z-10 flex items-center pointer-events-none will-change-transform ${className}`}
        style={{ opacity }}
      >
        <div
          className={`w-full ${
            isInteractive ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium mb-2 md:mb-3 lg:mb-6">
              About
            </h2>

            {/* Scroll-linked container */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden">
              {/* Fixed height viewport with scroll-linked content */}
              <div className="md:h-[380px] lg:h-[400px] relative overflow-hidden">
                <motion.div
                  ref={contentRef}
                  className="absolute inset-x-0 top-0 p-6 pr-4 will-change-transform"
                  style={{ y: contentY }}
                >
                  <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
                    {aboutContent.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>

                {/* Gradient masks for scroll indication */}
                <div
                  className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card/80 to-transparent pointer-events-none transition-opacity duration-200"
                  style={{ opacity: indicatorPercent > 5 ? 1 : 0 }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/80 to-transparent pointer-events-none transition-opacity duration-200"
                  style={{ opacity: indicatorPercent < 95 ? 1 : 0 }}
                />
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-border/30">
                <motion.div
                  className="h-full bg-[hsl(var(--eucalyptus))] dark:bg-[hsl(var(--rust))]"
                  style={{ width: `${indicatorPercent}%` }}
                />
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground/50 mt-2 font-mono">
              ↕ Keep scrolling
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
