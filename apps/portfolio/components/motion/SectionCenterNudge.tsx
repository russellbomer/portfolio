"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface SectionCenterNudgeProps {
  sectionIds?: string[];
  minWidth?: number;
}

const DEFAULT_SECTION_IDS = ["hero", "about", "standards", "work", "connect"];

export function SectionCenterNudge({
  sectionIds = DEFAULT_SECTION_IDS,
  minWidth = 1024,
}: SectionCenterNudgeProps) {
  const shouldReduceMotion = useReducedMotion();
  const isNudgingRef = useRef(false);
  const suppressUntilRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastGlobalNudgeRef = useRef(0);
  const lockedAnchorRef = useRef<{ id: string; targetScrollY: number } | null>(
    null
  );
  const directionalNudgeCooldownRef = useRef<Record<string, number>>({});

  // Pre-computed section center targets, using the same timing as ScrollProgressRail
  // so nudge destinations land at exactly the same scrollY as rail anchor positions.
  const precomputedTargetsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (shouldReduceMotion) return;

    const computeTargets = () => {
      const targets = new Map<string, number>();
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = rect.height;
        if (height <= 0) return;
        targets.set(id, Math.max(0, top + height * 0.5 - window.innerHeight * 0.5));
      });
      precomputedTargetsRef.current = targets;
    };

    computeTargets();
    window.addEventListener("resize", computeTargets);
    return () => window.removeEventListener("resize", computeTargets);
  }, [sectionIds, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const evaluateNudge = () => {
      rafRef.current = null;

      if (window.innerWidth < minWidth) return;
      if (isNudgingRef.current) return;

      const now = performance.now();
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollYRef.current;
      const deltaY = Math.abs(scrollDelta);
      const deltaT = now - lastTimeRef.current;
      const velocity = deltaT > 0 ? deltaY / deltaT : 0;

      lastScrollYRef.current = scrollY;
      lastTimeRef.current = now;

      const sections = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;

          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const height = rect.height;

          if (height <= 0) return null;

          // Use the pre-computed target so nudge destinations match rail anchor
          // positions exactly. Falls back to live calculation if not yet computed.
          const precomputedTarget = precomputedTargetsRef.current.get(id);
          const targetScrollY =
            precomputedTarget ??
            Math.max(0, top + height * 0.5 - window.innerHeight * 0.5);

          return {
            id,
            top,
            bottom: top + height,
            height,
            targetScrollY,
          };
        })
        .filter(
          (
            section
          ): section is {
            id: string;
            top: number;
            bottom: number;
            height: number;
            targetScrollY: number;
          } => section !== null
        );

      if (sections.length < 2) return;

      const viewportCenter = window.scrollY + window.innerHeight / 2;

      // Prevent chain-skipping: after nudging to an anchor, hold off until user
      // moves meaningfully away from that anchored center.
      const releasePx = Math.max(160, window.innerHeight * 0.2);
      if (lockedAnchorRef.current) {
        const distanceFromLocked = Math.abs(
          scrollY - lockedAnchorRef.current.targetScrollY
        );
        if (distanceFromLocked <= releasePx) {
          return;
        }
        lockedAnchorRef.current = null;
      }

      if (now < suppressUntilRef.current) return;

      // Skip nudging when user is moving quickly (gentler behavior)
      if (velocity > 1.6) return;

      // Global cooldown prevents repeated nudges in quick succession
      if (now - lastGlobalNudgeRef.current < 900) return;

      const currentIndex = sections.findIndex(
        (section) => viewportCenter >= section.top && viewportCenter <= section.bottom
      );

      if (currentIndex < 0) return;

      const current = sections[currentIndex];
      const next = sections[currentIndex + 1];
      const previous = sections[currentIndex - 1];
      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      const progress = (viewportCenter - current.top) / current.height;

      const isScrollingDown = scrollDelta > 0;
      const isScrollingUp = scrollDelta < 0;

      let target: { id: string; targetScrollY: number } | null = null;
      let cooldownKey: string | null = null;

      // Forward: same anchor snap behavior for all sections.
      // About -> Standards uses a later trigger point.
      if (isScrollingDown && next) {
        const forwardThreshold =
          current.id === "about" && next.id === "standards"
            ? 0.93
            : current.id === "hero" && next.id === "about"
              ? 0.68
              : 0.62;

        if (progress >= forwardThreshold && next.targetScrollY > scrollY + 12) {
          target = { id: next.id, targetScrollY: next.targetScrollY };
          cooldownKey = `${current.id}:down`;
        }
      }

      // If user continues downward past Connect anchor, snap to absolute page bottom.
      if (!target && isScrollingDown && current.id === "connect") {
        const connectBottomThreshold = 0.62;
        if (progress >= connectBottomThreshold && maxScrollY > scrollY + 8) {
          target = { id: "page-bottom", targetScrollY: maxScrollY };
          cooldownKey = "connect:down-bottom";
        }
      }

      // Reverse: mirrored behavior with same anchor snap target.
      // Standards -> About uses a later trigger point and lands at the
      // bottom of About's inner-content scroll phase for a true mirror feel.
      // About -> Hero always snaps to the very top of the page.
      if (!target && isScrollingUp && previous) {
        const backwardThreshold =
          current.id === "standards" && previous.id === "about" ? 0.22 : 0.38;

        let backwardTargetY = previous.targetScrollY;

        // Hero: always snap to the very top of the page
        if (previous.id === "hero") {
          backwardTargetY = 0;
        } else if (current.id === "standards" && previous.id === "about") {
          // About inner content reaches bottom around progress 0.74 in
          // ScrollLinkedAbout. Map that to absolute scrollY target.
          const aboutBottomProgress = 0.74;
          backwardTargetY =
            previous.top -
            window.innerHeight +
            aboutBottomProgress * (previous.height + window.innerHeight);
        }

        if (
          progress <= backwardThreshold &&
          backwardTargetY < scrollY - 12
        ) {
          target = { id: previous.id, targetScrollY: Math.max(0, backwardTargetY) };
          cooldownKey = `${current.id}:up`;
        }
      }

      if (!target) return;

      if (cooldownKey) {
        const lastDirectional = directionalNudgeCooldownRef.current[cooldownKey] ?? 0;
        if (now - lastDirectional < 1500) {
          return;
        }
        directionalNudgeCooldownRef.current[cooldownKey] = now;
      }

      isNudgingRef.current = true;
      lastGlobalNudgeRef.current = now;
      lockedAnchorRef.current = target;

      window.scrollTo({
        top: target.targetScrollY,
        behavior: "smooth",
      });

      window.setTimeout(() => {
        isNudgingRef.current = false;
      }, 850);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(evaluateNudge);
    };

    const onNavScrollStart = () => {
      suppressUntilRef.current = performance.now() + 900;
      lockedAnchorRef.current = null;
    };

    lastScrollYRef.current = window.scrollY;
    lastTimeRef.current = performance.now();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("section-navigation-scroll-start", onNavScrollStart);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("section-navigation-scroll-start", onNavScrollStart);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [minWidth, sectionIds, shouldReduceMotion]);

  return null;
}
