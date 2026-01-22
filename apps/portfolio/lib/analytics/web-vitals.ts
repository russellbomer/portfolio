// Minimal Web Vitals collection stub
// MILESTONE: day-2 (build)
// KPI: LCP < 1500ms
// EXIT-CRITERIA: instrumentation scaffold exists

import type { Metric } from "web-vitals";

// Consumer can replace this with real logging (e.g. POST to analytics endpoint)
function logMetric(metric: Metric) {
  // AI-OUTPUT: placeholder logging – replace with integration
  console.log("[WebVital]", metric.name, metric.value, metric.rating);
}

export async function initWebVitals() {
  if (typeof window === "undefined") return;
  // Dynamically import to avoid impacting initial bundle
  const { onLCP, onCLS, onINP } = await import("web-vitals");
  onLCP(logMetric);
  onCLS(logMetric);
  onINP(logMetric);
}
