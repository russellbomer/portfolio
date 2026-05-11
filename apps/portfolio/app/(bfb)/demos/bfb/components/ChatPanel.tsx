"use client";

import { useEffect, useRef } from "react";
import { Search, SquarePen } from "lucide-react";

const CHATS = [
  {
    id: 1,
    name: "BFB Subscriber Chat",
    avatar: "/images/bfb/bfb-icon.png",
    avatarRadius: "8px",
    preview: "Click here to start the subscriber chat",
    time: "",
    dot: null,
    locked: false,
    italic: true,
  },
  {
    id: 2,
    name: "Browns Film Breakdown",
    avatar: "/images/bfb/bfb-icon.png",
    avatarRadius: "8px",
    preview: "OUT: New film breakdown dropping tonight — stay tuned",
    time: "11:23 am",
    dot: null,
    locked: false,
    italic: false,
  },
  {
    id: 3,
    name: "Gridiron Gazette",
    avatar: null,
    avatarBg: "#2a4d8f",
    avatarRadius: "8px",
    preview: "Casey: Loved the breakdown on the safety package",
    time: "5/8",
    dot: "orange",
    locked: false,
    italic: false,
  },
  {
    id: 4,
    name: "Scenic Overlook Weekly",
    avatar: null,
    avatarBg: "#6b8c42",
    avatarRadius: "8px",
    preview: "Mia: I've literally never seen a route tree like that",
    time: "5/7",
    dot: "orange",
    locked: false,
    italic: false,
  },
  {
    id: 5,
    name: "Brad Ward",
    avatar: "/images/bfb/avatar-brad.png",
    avatarRadius: "50%",
    preview: "Brad liked your comment",
    time: "5/1",
    dot: null,
    locked: false,
    italic: false,
  },
  {
    id: 6,
    name: "The Long View",
    avatar: null,
    avatarBg: "#8b4513",
    avatarRadius: "8px",
    preview: "🔗 Part 3: The Second Season — why it matters",
    time: "8/20/25",
    dot: null,
    locked: false,
    italic: false,
  },
  {
    id: 7,
    name: "Velvet Underground Digest",
    avatar: null,
    avatarBg: "#4a3060",
    avatarRadius: "8px",
    preview: "🔒 Paid subscribers only",
    time: "",
    dot: null,
    locked: true,
    italic: false,
  },
];

interface ChatPanelProps {
  onClose: () => void;
  anchorLeft: number;
}

export function ChatPanel({ onClose, anchorLeft }: ChatPanelProps) {
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
    <div ref={panelRef} style={{
        position: "fixed",
        top: "67px",
        left: `${anchorLeft - 188}px`,
        width: "376px",
        height: "738px",
        backgroundColor: "var(--bfb-bg)",
        border: "1px solid var(--bfb-border)",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 16px", borderBottom: "1px solid var(--bfb-border)" }}>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>Chat</span>
          <button style={{ background: "none", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "var(--bfb-text-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SquarePen size={18} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--bfb-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--bfb-bg-contrast-1)", borderRadius: "20px", padding: "8px 14px" }}>
            <Search size={14} color="var(--bfb-text-secondary)" />
            <span style={{ fontSize: "14px", color: "var(--bfb-text-secondary)" }}>Search chats</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", padding: "10px 16px", borderBottom: "1px solid var(--bfb-border)" }}>
          {["All", "Direct", "Unread"].map((tab) => (
            <button key={tab} style={{
              padding: "4px 14px",
              borderRadius: "20px",
              border: tab === "All" ? "1px solid var(--bfb-border)" : "none",
              background: tab === "All" ? "var(--bfb-bg)" : "none",
              fontSize: "13px",
              fontWeight: tab === "All" ? 600 : 400,
              color: "var(--bfb-text-primary)",
              cursor: "pointer",
            }}>{tab}</button>
          ))}
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {CHATS.map((chat) => (
            <div key={chat.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderBottom: "1px solid var(--bfb-border)", position: "relative" }}>
              {/* Unread dot */}
              {chat.dot && (
                <div style={{ position: "absolute", left: "4px", top: "50%", transform: "translateY(-50%)", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--bfb-accent)" }} />
              )}

              {/* Avatar */}
              <div style={{ width: "46px", height: "46px", borderRadius: chat.avatarRadius, backgroundColor: chat.avatarBg ?? "var(--bfb-bg-contrast-2)", flexShrink: 0, overflow: "hidden" }}>
                {chat.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={chat.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--bfb-text-primary)" }}>{chat.name}</span>
                  {chat.time && <span style={{ fontSize: "12px", color: "var(--bfb-text-secondary)", flexShrink: 0 }}>{chat.time}</span>}
                </div>
                <div style={{ fontSize: "13px", color: "var(--bfb-text-secondary)", marginTop: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontStyle: chat.italic ? "italic" : "normal" }}>
                  {chat.preview}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--bfb-border)", textAlign: "center" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: 600, color: "var(--bfb-text-primary)" }}>
            See all
          </button>
        </div>
      </div>
  );
}
