"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  className?: string;
  /** Delay before typing starts (ms) */
  delay?: number;
  /** Time per character (ms) */
  speed?: number;
  /** Show blinking cursor */
  showCursor?: boolean;
  /** Hide cursor immediately when complete (no fade) */
  hideCursorOnComplete?: boolean;
  /** Called when typing completes */
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  className = "",
  delay = 0,
  speed = 50,
  showCursor = true,
  hideCursorOnComplete = false,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, shouldReduceMotion, text, onComplete]);

  useEffect(() => {
    if (!isTyping || shouldReduceMotion) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, isTyping, text, speed, shouldReduceMotion, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && isTyping && !isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
      {showCursor && isComplete && !hideCursorOnComplete && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      )}
    </span>
  );
}

interface TypewriterSequenceProps {
  children: React.ReactNode;
  className?: string;
}

interface TypewriterLineProps {
  text: string;
  className?: string;
  element?: "p" | "h1" | "h2" | "h3" | "span";
  delay?: number;
  speed?: number;
}

export function TypewriterLine({
  text,
  className = "",
  element: Element = "p",
  delay = 0,
  speed = 50,
}: TypewriterLineProps) {
  return (
    <Element className={className}>
      <TypewriterText text={text} delay={delay} speed={speed} />
    </Element>
  );
}
