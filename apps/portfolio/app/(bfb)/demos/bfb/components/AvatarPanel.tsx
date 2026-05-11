"use client";

import { useEffect, useRef } from "react";
import { Home, Inbox, MessageCircle, Bell, Compass, BarChart2 } from "lucide-react";

const NAV_ITEMS = [
  { icon: <Home size={18} />, label: "Home" },
  { icon: <Inbox size={18} />, label: "Subscriptions" },
  { icon: <MessageCircle size={18} />, label: "Chat" },
  { icon: <Bell size={18} />, label: "Activity" },
  { icon: <Compass size={18} />, label: "Explore" },
];

const ITEM_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "10px 16px",
  fontSize: "15px",
  color: "var(--bfb-text-primary)",
  cursor: "pointer",
  textDecoration: "none",
};

const LINK_STYLE: React.CSSProperties = {
  display: "block",
  padding: "10px 16px",
  fontSize: "15px",
  color: "var(--bfb-text-primary)",
  cursor: "pointer",
  textDecoration: "none",
};

const DIVIDER: React.CSSProperties = {
  borderTop: "1px solid var(--bfb-border)",
  margin: "4px 0",
};

interface AvatarPanelProps {
  onClose: () => void;
  anchorRight: number;
}

export function AvatarPanel({ onClose, anchorRight }: AvatarPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-panel-toggle]")) return;
      if (!panelRef.current?.contains(t)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: "67px",
        right: `${anchorRight}px`,
        width: "280px",
        backgroundColor: "var(--bfb-bg)",
        border: "1px solid var(--bfb-border)",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bfb/helmet-logo.png"
          alt=""
          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "contain", flexShrink: 0, boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }}
        />
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>Preview User</div>
          <div style={{ fontSize: "13px", color: "var(--bfb-text-secondary)" }}>@previewuser</div>
        </div>
      </div>

      <div style={DIVIDER} />

      {/* Nav items */}
      {NAV_ITEMS.map(({ icon, label }) => (
        <a key={label} href="https://www.brownsfilmbreakdown.com" target="_blank" rel="noopener noreferrer" style={ITEM_STYLE}>
          <span style={{ color: "var(--bfb-text-secondary)", display: "flex" }}>{icon}</span>
          {label}
        </a>
      ))}

      <div style={DIVIDER} />

      {/* Manage + Dashboard */}
      <a href="https://www.brownsfilmbreakdown.com/subscribe" target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
        Manage subscription
      </a>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "pointer" }}>
        <span style={{ fontSize: "15px", color: "var(--bfb-text-primary)" }}>Dashboard</span>
        <BarChart2 size={16} color="var(--bfb-text-secondary)" />
      </div>

      <div style={DIVIDER} />

      {/* Settings / Support / Sign out */}
      <a href="#" style={LINK_STYLE}>Settings</a>
      <a href="#" style={LINK_STYLE}>Support</a>
      <a href="#" style={LINK_STYLE}>Sign out</a>

      <div style={DIVIDER} />

      {/* Footer links */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", padding: "10px 16px" }}>
        {["About", "Privacy", "Terms", "Data", "Accessibility"].map((label) => (
          <a key={label} href="#" style={{ fontSize: "12px", color: "var(--bfb-text-secondary)", textDecoration: "none" }}>{label}</a>
        ))}
      </div>
    </div>
  );
}
