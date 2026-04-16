"use client";

import { useEffect, useState } from "react";

/**
 * Shows a blocking overlay when a mobile phone is held in landscape orientation.
 * Detection: landscape (width > height) AND small height (< 500px) to target phones,
 * not tablets or desktops.
 * Also attempts the Screen Orientation API lock for browsers that support it
 * (Android Chrome in fullscreen/PWA context).
 */
export function LockPortrait() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Best-effort API lock — works in Android PWA/fullscreen, silently fails elsewhere
    if (
      typeof screen !== "undefined" &&
      screen.orientation &&
      "lock" in screen.orientation
    ) {
      (screen.orientation as { lock: (o: string) => Promise<void> })
        .lock("portrait")
        .catch(() => {});
    }

    const check = () => {
      const landscape = window.innerWidth > window.innerHeight;
      // Max height of ~500px in landscape covers all phones (375–430px) but not tablets
      const isPhone = window.innerHeight < 500;
      setShowOverlay(landscape && isPhone);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      aria-live="polite"
      role="alert"
    >
      <p className="font-mono text-xs text-muted-foreground">
        ↻ Please rotate your device
      </p>
    </div>
  );
}
