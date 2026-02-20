"use client";

import { useEffect } from "react";

/**
 * Reads the URL hash on mount and scrolls to the target section using
 * the same center-aligned scroll math as SidebarNav.scrollToSection.
 *
 * This ensures that "Back to home" links from sub-pages (e.g. /home#standards)
 * land at the exact scroll position where the section's fixed overlay content
 * is at peak opacity and the pinwheel decoration is square with the viewport.
 */
export function HashScrollHandler() {
    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (!hash) return;

        // Small delay so the DOM (including 200vh/400vh scroll spacers) is fully laid out
        const timer = setTimeout(() => {
            const element = document.getElementById(hash);
            if (!element) return;

            // Signal other scroll helpers to stand down during navigation
            window.dispatchEvent(
                new CustomEvent("section-navigation-scroll-start")
            );

            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementHeight = rect.height;

            // Scroll to 50% of the section's scroll trigger for peak opacity positioning
            const targetScroll =
                elementTop + elementHeight * 0.5 - window.innerHeight * 0.5;

            window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: "smooth",
            });

            // Clear the hash from the URL to avoid conflicts on subsequent navigations
            window.history.replaceState(null, "", window.location.pathname);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
