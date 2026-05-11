import { Check, ChevronRight } from "lucide-react";
import { SearchTrigger } from "./SearchTrigger";
import { PostCard } from "./PostCard";
import { RECENT_POSTS } from "../data";

const RECOMMENDATIONS = [
  {
    name: "Buckeye Film Breakdown",
    author: "Buckeye Film Breakdown",
    url: "https://www.buckeyefilmbreakdown.com/",
    logo: "https://substackcdn.com/image/fetch/w_96,h_96,c_fill,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F256f4375-8beb-4f2e-bc81-59283bba110f_500x500.png",
  },
  {
    name: "Daft on Draft",
    author: "Cory Kinnan",
    url: "https://www.daftondraft.football/",
    logo: "https://substackcdn.com/image/fetch/w_96,h_96,c_fill,f_auto,q_auto:good/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F591df660-57f6-4259-ae30-b80d9a44292e_600x600.png",
  },
  {
    name: "The Bill and Doug Show: Premium Ohio State Writing & Talk",
    author: "Bill Landis",
    url: "https://billanddougosu.substack.com/",
    logo: "https://substackcdn.com/image/fetch/w_96,h_96,c_fill,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7049b4df-f8f0-4859-a6ad-3ae90001e102_600x600.png",
  },
  {
    name: "MatchQuarters by Cody Alexander",
    author: "Cody Alexander",
    url: "https://www.matchquarters.com/",
    logo: "https://substackcdn.com/image/fetch/w_96,h_96,c_fill,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F79d967ed-ee15-4e82-8d61-b41b61a7bf6d_1280x1280.png",
  },
];

const SOCIAL = [
  { label: "Twitter", url: "https://x.com/BrownsFilmBDN" },
  { label: "Instagram", url: "https://www.instagram.com/brownsfilmbreakdown/" },
  { label: "YouTube", url: "https://www.youtube.com/@brownsfilmbreakdown" },
  { label: "TikTok", url: "https://www.tiktok.com/@brownsfilmbreakdown" },
  { label: "Facebook", url: "https://www.facebook.com/brownsfilmbreakdown" },
];


export function BodySection() {
  return (
    <section style={{ borderBottom: "1px solid var(--bfb-border)", padding: "32px 20px" }}>
      <div
        style={{
          maxWidth: "1224px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "279px 594px 279px",
          justifyContent: "space-between",
        }}
      >
        {/* ── Left: Publication info (279px = card 1) ── */}
        <div>
          {/* Logo */}
          <div style={{ marginBottom: "12px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bfb/bfb-icon.png"
              alt="Browns Film Breakdown"
              style={{ width: "32px", height: "32px", display: "block", borderRadius: "6px" }}
            />
            <div style={{ marginTop: "8px", marginBottom: "4px", fontSize: "17px", fontWeight: 700, color: "var(--bfb-text-primary)", lineHeight: 1 }}>
              Browns Film Breakdown
            </div>
          </div>

          {/* Tagline */}
          <p style={{ margin: "0 0 14px", fontSize: "12px", lineHeight: 1.3, color: "var(--bfb-text-secondary)" }}>
            In-depth Browns analysis, breaking it down for the most passionate fans in the NFL.
          </p>

          {/* Subscribed badge */}
          <a
            href="https://www.brownsfilmbreakdown.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="bfb-subscribed-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "142px",
              height: "37px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#ff3600",
              backgroundColor: "#ffd7cc",
              border: "none",
              borderRadius: "6px",
              textDecoration: "none",
              marginBottom: "20px",
            }}
          >
            <Check size={17} strokeWidth={2.5} style={{ marginRight: "6px" }} />
            Subscribed
          </a>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--bfb-border)", margin: "4px 0 21px" }} />

          {/* Social links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>
              Social
            </div>
            {SOCIAL.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bfb-hover-underline"
                style={{ fontSize: "15px", color: "var(--bfb-text-primary)", textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Center: Recent posts (594px = cards 2+3) ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
            <h3 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>Recent posts</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "26px" }}>
              <SearchTrigger size={20} />
              <a
                href="https://www.brownsfilmbreakdown.com/archive"
                target="_blank"
                rel="noopener noreferrer"
                className="bfb-hover-underline"
                style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--bfb-text-secondary)", textDecoration: "none" }}
              >
                VIEW ALL
              </a>
            </div>
          </div>
          <div className="bfb-recent-posts">
            {RECENT_POSTS.map((post, i) => (
              <PostCard key={post.id} post={post} variant="list" isLast={i === RECENT_POSTS.length - 1} />
            ))}
          </div>
          <a
            href="https://www.brownsfilmbreakdown.com/archive"
            target="_blank"
            rel="noopener noreferrer"
            className="bfb-see-all-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "106px",
              height: "40px",
              marginTop: "16px",
              backgroundColor: "var(--bfb-bg-contrast-1)",
              color: "var(--bfb-text-primary)",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            See all <ChevronRight size={22} style={{ marginLeft: "2px" }} />
          </a>
        </div>

        {/* ── Right: Recommendations (279px = card 4) ── */}
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>Recommendations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {RECOMMENDATIONS.map(({ name, author, url, logo }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bfb-recommendation"
                style={{ display: "flex", alignItems: "flex-start", gap: "10px", textDecoration: "none", borderRadius: "4px", padding: "8px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt=""
                  width={40}
                  height={40}
                  style={{ borderRadius: "6px", flexShrink: 0, display: "block" }}
                />
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--bfb-text-primary)", lineHeight: 1.3 }}>
                    {name}
                  </div>
                  {author && (
                    <div style={{ fontSize: "12px", color: "var(--bfb-text-secondary)", marginTop: "2px" }}>
                      {author}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
