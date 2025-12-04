"use client";

import { motion } from "framer-motion";
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
  // Handle reduced motion - set state synchronously before render
  const initialComplete = shouldReduceMotion;
  const [displayedText, setDisplayedText] = useState(
    shouldReduceMotion ? text : ""
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(initialComplete);

  // Fire onComplete callback for reduced motion
  useEffect(() => {
    if (shouldReduceMotion) {
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping || shouldReduceMotion) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      // Using queueMicrotask to avoid synchronous setState warning
      queueMicrotask(() => {
        setIsComplete(true);
        onComplete?.();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedText, isTyping, text, speed, isComplete]);

  // Split text to attach cursor to last character (prevents cursor from wrapping alone)
  const lastChar = displayedText.slice(-1);
  const textWithoutLast = displayedText.slice(0, -1);
  const hasText = displayedText.length > 0;

  const cursor = (
    <>
      {showCursor && isTyping && !isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
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
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, width: 0, marginLeft: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      )}
    </>
  );

  return (
    <span className={className}>
      {textWithoutLast}
      {hasText && (
        <span className="whitespace-nowrap">
          {lastChar}
          {cursor}
        </span>
      )}
      {!hasText && cursor}
    </span>
  );
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
