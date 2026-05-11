"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MessageCircle, Bell } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { NotificationsPanel } from "./NotificationsPanel";
import { ChatPanel } from "./ChatPanel";
import { AvatarPanel } from "./AvatarPanel";

const NAV_ITEMS = [
  { label: "Home",        url: "https://www.brownsfilmbreakdown.com/",             active: true,  newTab: false },
  { label: "Podcast",     url: "https://www.brownsfilmbreakdown.com/s/podcast",     active: false, newTab: false },
  { label: "Film",        url: "https://www.brownsfilmbreakdown.com/s/film-room",   active: false, newTab: false },
  { label: "News",        url: "https://www.brownsfilmbreakdown.com/notes",         active: false, newTab: true  },
  { label: "Chat",        url: "https://www.brownsfilmbreakdown.com/chat",          active: false, newTab: true  },
  { label: "Shop",        url: "https://brownsfilmbreakdown.itemorder.com/shop/home/", active: false, newTab: true  },
  { label: "Leaderboard", url: "https://www.brownsfilmbreakdown.com/leaderboard",   active: false, newTab: false },
  { label: "About",       url: "https://www.brownsfilmbreakdown.com/about",         active: false, newTab: false },
];

const ICON_BTN: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  color: "var(--bfb-text-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function BFBHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    const handler = () => { setChatOpen(false); setNotifOpen(false); setSearchOpen(true); };
    window.addEventListener("bfb-open-search", handler);
    return () => window.removeEventListener("bfb-open-search", handler);
  }, []);
  const [tooltip, setTooltip] = useState<{ text: string; x: number } | null>(null);

  function showTip(e: React.MouseEvent, text: string) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ text, x: r.left + r.width / 2 });
  }
  function hideTip() { setTooltip(null); }
  const bellRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [panelLeft, setPanelLeft] = useState(0);
  const [chatPanelLeft, setChatPanelLeft] = useState(0);
  const [avatarPanelRight, setAvatarPanelRight] = useState(0);

  function toggleNotif() {
    const r = bellRef.current?.getBoundingClientRect();
    if (r) setPanelLeft(r.left + r.width / 2);
    setChatOpen(false); setAvatarOpen(false);
    setNotifOpen(o => !o);
  }

  function toggleChat() {
    const r = chatRef.current?.getBoundingClientRect();
    if (r) setChatPanelLeft(r.left + r.width / 2);
    setNotifOpen(false); setAvatarOpen(false);
    setChatOpen(o => !o);
  }

  function toggleAvatar() {
    const r = avatarRef.current?.getBoundingClientRect();
    if (r) setAvatarPanelRight(window.innerWidth - r.right);
    setNotifOpen(false); setChatOpen(false);
    setAvatarOpen(o => !o);
  }

  return (
    <>
      {/* ── Top bar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "87px",
          backgroundColor: "var(--bfb-bg)",
          borderBottom: "1px solid var(--bfb-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          gap: "12px",
          zIndex: 200,
        }}
      >
        {/* Left — B icon */}
        <a href="https://www.brownsfilmbreakdown.com/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.open("https://www.brownsfilmbreakdown.com/", "_blank"); }} style={{ flexShrink: 0, display: "block", cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://substackcdn.com/image/fetch/w_256,h_256,c_fill,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F22f7cb63-2ac2-4337-83ba-bcf37d13c9ec_256x256.png"
            alt="Browns Film Breakdown"
            width={40}
            height={40}
            style={{ borderRadius: "8px", display: "block" }}
          />
        </a>

        {/* Center — wordmark (absolutely centered) */}
        <a
          href="https://www.brownsfilmbreakdown.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "block",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://substackcdn.com/image/fetch/h_72,c_limit,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F81b163d6-a537-48c9-8e23-f7cdbc11942b_1119x256.png"
            alt="BROWNS FILM BREAKDOWN"
            height={36}
            style={{ height: "36px", width: "auto", display: "block" }}
          />
        </a>

        {/* Right — icons + CTA + avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          <button className="bfb-icon-btn" data-panel-toggle="search" style={ICON_BTN} aria-label="Search" onMouseEnter={(e) => showTip(e, "Search")} onMouseLeave={hideTip} onClick={() => { setChatOpen(false); setNotifOpen(false); setSearchOpen(true); }}>
            <Search size={20} />
          </button>
          <div ref={chatRef}>
          <button className="bfb-icon-btn" data-panel-toggle="chat" style={ICON_BTN} aria-label="Chat" onMouseEnter={(e) => showTip(e, "Chat")} onMouseLeave={hideTip} onClick={toggleChat}>
            <MessageCircle size={20} />
          </button>
          </div>
          <div ref={bellRef}>
            <button className="bfb-icon-btn" data-panel-toggle="notif" style={ICON_BTN} aria-label="Notifications" onMouseEnter={(e) => showTip(e, "Activity")} onMouseLeave={hideTip} onClick={toggleNotif}>
              <Bell size={20} />
            </button>
          </div>

          <a
            href="https://www.brownsfilmbreakdown.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="bfb-upgrade-btn"
            style={{
              backgroundColor: "var(--bfb-accent)",
              color: "var(--bfb-print-on-accent)",
              borderRadius: "7px",
              width: "179px",
              height: "39px",
              fontSize: "15px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              marginLeft: "8px",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            Upgrade to founding
          </a>

          {/* Avatar */}
          <div ref={avatarRef} data-panel-toggle="avatar" style={{ position: "relative", flexShrink: 0, marginLeft: "4px", cursor: "pointer" }} onClick={toggleAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bfb/helmet-logo.png"
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "contain",
                display: "block",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.1)",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: "0px",
              right: "-2px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "var(--bfb-bg-contrast-1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
            }}>
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 5L0 0H7L3.5 5Z" fill="#515151" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ── Section nav ── */}
      <nav
        aria-label="Site sections"
        style={{
          position: "fixed",
          top: "87px",
          left: 0,
          right: 0,
          height: "48px",
          backgroundColor: "var(--bfb-bg)",
          borderTop: "1px solid var(--bfb-border)",
          borderBottom: "1px solid var(--bfb-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          overflowX: "auto",
        }}
      >
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {NAV_ITEMS.map(({ label, url, active, newTab }) => (
            <li
              key={label}
              className="bfb-nav-item"
              style={{
                height: "100%",
                display: "flex",
                alignItems: "stretch",
                flexShrink: 0,
              }}
            >
              <a
                href={url}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
                style={{
                  padding: "0 13px",
                  height: "100%",
                  display: "flex",
                  alignItems: "stretch",
                  textDecoration: "none",
                  flexShrink: 0,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {/* Column-flex shrunk to text width — underline child sits at bottom */}
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 0, flexShrink: 0 }}>
                  <span
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      fontWeight: active ? 700 : 400,
                      color: "var(--bfb-text-primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      display: "block",
                      height: "3px",
                      backgroundColor: active ? "var(--bfb-text-primary)" : "transparent",
                    }}
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {tooltip && (
        <div style={{
          position: "fixed",
          top: "87px",
          left: `${tooltip.x}px`,
          transform: "translateX(-50%) translateY(-50%)",
          animation: "bfb-tooltip-in 0.25s ease 0.4s both",
          backgroundColor: "#000",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 500,
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}>
          {tooltip.text}
        </div>
      )}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} anchorLeft={panelLeft} />}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} anchorLeft={chatPanelLeft} />}
      {avatarOpen && <AvatarPanel onClose={() => setAvatarOpen(false)} anchorRight={avatarPanelRight} />}
    </>
  );
}
