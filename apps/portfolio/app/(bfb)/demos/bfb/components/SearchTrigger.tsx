"use client";

import { Search } from "lucide-react";

export function SearchTrigger({ size = 20 }: { size?: number }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("bfb-open-search"))}
      className="bfb-icon-btn"
      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "6px", color: "var(--bfb-text-secondary)" }}
      aria-label="Search"
    >
      <Search size={size} />
    </button>
  );
}
