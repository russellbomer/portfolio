"use client";

import { useEffect } from "react";
import { Search, X } from "lucide-react";
import { HERO_POSTS } from "../data";

const PEOPLE = [
  { name: "Jake Burns", handle: "@jakeburns", avatar: "/images/bfb/avatar-jake.png" },
  { name: "Brad Ward", handle: "@bradward", avatar: "/images/bfb/avatar-brad.png" },
  { name: "Cody Suek", handle: "@codysuek", avatar: "/images/bfb/avatar-cody.png" },
];

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px",
          height: "615px",
          backgroundColor: "var(--bfb-bg)",
          borderRadius: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* Search input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          borderBottom: "1px solid var(--bfb-border)",
        }}>
          <Search size={18} color="var(--bfb-text-secondary)" style={{ flexShrink: 0 }} />
          <input
            autoFocus
            type="text"
            placeholder="Search people and posts"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              color: "var(--bfb-text-primary)",
              backgroundColor: "transparent",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--bfb-text-secondary)", display: "flex", padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
          {/* People */}
          <div style={{ padding: "16px 0 8px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--bfb-text-secondary)", marginBottom: "12px" }}>
              People
            </div>
            {PEOPLE.map(({ name, handle, avatar }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--bfb-text-primary)" }}>{name}</div>
                  <div style={{ fontSize: "12px", color: "var(--bfb-text-secondary)" }}>{handle}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--bfb-border)", padding: "16px 0 8px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--bfb-text-secondary)", marginBottom: "12px" }}>
              Posts
            </div>
            {HERO_POSTS.slice(0, 4).map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", textDecoration: "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnailUrl}
                  alt=""
                  style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "14px", fontWeight: 600, color: "var(--bfb-text-primary)",
                    overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                  }}>
                    {post.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--bfb-text-secondary)", marginTop: "2px" }}>
                    {post.date} · {post.author}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid var(--bfb-border)",
          fontSize: "12px",
          fontStyle: "italic",
          color: "var(--bfb-text-tertiary)",
          textAlign: "center",
        }}>
          Search is not functional in this preview.
        </div>
      </div>
    </div>
  );
}
