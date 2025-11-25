// Minimal Web Vitals collection stub
// MILESTONE: day-2 (build)
// KPI: LCP < 1500ms
// EXIT-CRITERIA: instrumentation scaffold exists

import type { Metric } from "web-vitals";

// Send metric to backend; fall back to console if send fails.
function transmit(metric: Metric) {
  const payload = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: (metric as any).rating,
    delta: (metric as any).delta,
    navigationType: (metric as any).navigationType,
    timestamp: Date.now(),
  };

  try {
    const json = JSON.stringify(payload);
    // Prefer sendBeacon to avoid blocking unload.
    if (navigator && "sendBeacon" in navigator) {
      const blob = new Blob([json], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/metrics", blob);
      if (!ok) throw new Error("sendBeacon failed");
    } else {
      fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Last resort: console log so we still see data in dev.
    console.warn("[WebVital:FALLBACK]", payload, err);
  }
}

export async function initWebVitals() {
  if (typeof window === "undefined") return;
  try {
    const { onLCP, onCLS, onINP, onFID, onTTFB } = await import("web-vitals");
    onLCP(transmit);
    onCLS(transmit);
    onINP(transmit);
    onFID?.(transmit);
    onTTFB?.(transmit);
  } catch (e) {
    console.warn("web-vitals dynamic import failed", e);
  }
}
