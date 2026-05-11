"use client";

import { useEffect, useRef } from "react";
import { Settings, Sparkles, Reply, Heart } from "lucide-react";

const ACTIVITIES = [
  {
    id: 1,
    type: "follow",
    iconBg: "#ede8f7",
    iconColor: "#7b5ea7",
    icon: <Sparkles size={13} />,
    avatarBg: "#b0c4b1",
    name: "BrownsDawg22",
    text: "is on Substack",
    date: "May 8",
    showFollow: true,
    quote: null,
  },
  {
    id: 2,
    type: "follow",
    iconBg: "#ede8f7",
    iconColor: "#7b5ea7",
    icon: <Sparkles size={13} />,
    avatarBg: "#c9a96e",
    name: "DawgPoundFilm",
    text: "is on Substack",
    date: "May 5",
    showFollow: true,
    quote: null,
  },
  {
    id: 3,
    type: "reply",
    iconBg: "#ddf0fb",
    iconColor: "#3a90c4",
    icon: <Reply size={13} />,
    avatarBg: "#8ab4c9",
    name: "WobblyPenguin77",
    text: "replied to your thread",
    date: "May 4",
    showFollow: false,
    quote: "Great breakdown — the alignment shift on third down is exactly what I was seeing too.",
  },
  {
    id: 4,
    type: "react",
    iconBg: "#fde8ec",
    iconColor: "#d95f76",
    icon: <Heart size={13} />,
    avatarBg: "#a3b899",
    name: "ClevelandFilmNerd",
    text: "reacted to your reply",
    date: "Apr 29",
    showFollow: true,
    quote: "The film doesn't lie — this team has the pieces if they stay healthy.",
  },
];

interface NotificationsPanelProps {
  onClose: () => void;
  anchorLeft: number;
}

export function NotificationsPanel({ onClose, anchorLeft }: NotificationsPanelProps) {
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
    <>
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
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 16px 16px",
          borderBottom: "1px solid var(--bfb-border)",
        }}>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>Activity</span>
          <button style={{
            background: "none",
            border: "none",
            borderRadius: "6px",
            padding: "6px",
            cursor: "pointer",
            color: "var(--bfb-text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Settings size={18} />
          </button>
        </div>

        {/* Activity list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {ACTIVITIES.map((item) => (
            <div key={item.id} style={{
              padding: "16px",
              borderBottom: "1px solid var(--bfb-border)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                {/* Type icon */}
                <div style={{
                  width: "26px", height: "26px", borderRadius: "50%",
                  backgroundColor: item.iconBg, color: item.iconColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "2px",
                }}>
                  {item.icon}
                </div>

                {/* Avatar */}
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  backgroundColor: item.avatarBg, flexShrink: 0,
                }} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--bfb-text-primary)", lineHeight: 1.4 }}>
                      <strong>{item.name}</strong> {item.text}{" "}
                      <span style={{ color: "var(--bfb-text-secondary)", fontSize: "13px" }}>{item.date}</span>
                    </p>
                    {item.showFollow && (
                      <button style={{
                        backgroundColor: "var(--bfb-accent)",
                        color: "var(--bfb-print-on-accent)",
                        border: "none",
                        borderRadius: "20px",
                        padding: "5px 14px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}>
                        Follow
                      </button>
                    )}
                  </div>
                  {item.quote && (
                    <p style={{
                      margin: "6px 0 0",
                      fontSize: "13px",
                      color: "var(--bfb-text-secondary)",
                      lineHeight: 1.4,
                    }}>
                      {item.quote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px",
          borderTop: "1px solid var(--bfb-border)",
          textAlign: "center",
        }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "15px", fontWeight: 600, color: "var(--bfb-text-primary)",
          }}>
            See all
          </button>
        </div>
      </div>
    </>
  );
}

