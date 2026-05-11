import { Pin, Lock, Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";
import type { BFBPost } from "../data";

export type PostCardVariant = "small" | "featured" | "list";

interface PostCardProps {
  post: BFBPost;
  variant?: PostCardVariant;
  isLast?: boolean;
}

function Thumbnail({
  post,
  variant: _variant,
}: {
  post: BFBPost;
  variant: PostCardVariant;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3 / 2",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "var(--bfb-bg-contrast-2)",
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.thumbnailUrl}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {post.duration && (
        <span
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            backgroundColor: "rgba(0,0,0,0.72)",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 500,
            padding: "2px 6px",
            borderRadius: "2px",
            lineHeight: 1.4,
          }}
        >
          {post.duration}
        </span>
      )}
    </div>
  );
}

function MetaLine({ post, centered }: { post: BFBPost; centered?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: centered ? "center" : "flex-start",
        gap: "4px",
        color: "var(--bfb-text-secondary)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginTop: "6px",
        flexWrap: "wrap",
      }}
    >
      {post.isPinned && (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "3px",
          backgroundColor: "var(--bfb-bg-contrast-1)",
          flexShrink: 0,
        }}>
          <Pin size={12} style={{ color: "var(--bfb-bg-contrast-5)" }} />
        </span>
      )}
      {post.isPaywalled && (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "3px",
          backgroundColor: "var(--bfb-bg-contrast-1)",
          flexShrink: 0,
        }}>
          <Lock size={12} style={{ color: "var(--bfb-bg-contrast-5)" }} />
        </span>
      )}
      <span>{post.date}</span>
      <span>·</span>
      <span className="bfb-hover-underline" style={{ cursor: "pointer" }}>{post.author}</span>
    </div>
  );
}

const CARD_LINK: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
};

const INTERACT_BTN: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px 8px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "var(--bfb-text-secondary)",
  fontSize: "13px",
};

function InteractionRow({ narrow }: { narrow?: boolean }) {
  return (
    <div
      className="bfb-interactions"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: narrow ? "center" : "space-between",
        gap: narrow ? "20px" : undefined,
        marginTop: "8px",
        width: narrow ? "fit-content" : "100%",
        marginLeft: narrow ? "auto" : undefined,
        marginRight: narrow ? "auto" : undefined,
      }}
    >
      <button className="bfb-interact-btn" style={INTERACT_BTN}><Heart size={15} /><span>2</span></button>
      <button className="bfb-interact-btn" style={INTERACT_BTN}><MessageCircle size={15} /></button>
      <button className="bfb-interact-btn" style={INTERACT_BTN}><Repeat2 size={15} /></button>
      <button className="bfb-interact-btn" style={INTERACT_BTN}><Share2 size={15} /></button>
    </div>
  );
}

// ─── Small card (hero side columns + section grids) ───────────────────────────
function SmallCard({ post }: { post: BFBPost }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="bfb-card" style={CARD_LINK}>
    <article style={{ backgroundColor: "var(--bfb-bg-elevated)" }}>
      <Thumbnail post={post} variant="small" />
      <div style={{ padding: "10px 0 8px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "19px",
            fontWeight: 700,
            lineHeight: 1.45,
            color: "var(--bfb-text-primary)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: "14px",
            lineHeight: 1.45,
            color: "#606060",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </p>
        <MetaLine post={post} />
        <InteractionRow />
      </div>
    </article>
    </a>
  );
}

// ─── Featured card (hero center) ─────────────────────────────────────────────
function FeaturedCard({ post }: { post: BFBPost }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="bfb-card" style={CARD_LINK}>
    <article style={{ backgroundColor: "var(--bfb-bg-elevated)" }}>
      <Thumbnail post={post} variant="featured" />
      <div style={{ padding: "70px 80px 10px", textAlign: "center" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: 700,
            lineHeight: 1.25,
            color: "var(--bfb-text-primary)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            margin: "10px 52px 0",
            fontSize: "18px",
            lineHeight: 1.35,
            letterSpacing: "-0.035em",
            color: "#606060",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </p>
        <MetaLine post={post} centered />
        <InteractionRow narrow />
      </div>
    </article>
    </a>
  );
}

// ─── List card (recent posts footer) ─────────────────────────────────────────
function ListCard({ post, isLast }: { post: BFBPost; isLast?: boolean }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="bfb-card" style={CARD_LINK}>
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "15px 0 20px",
        borderBottom: isLast ? "none" : "1px solid var(--bfb-border)",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--bfb-text-primary)",
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "15px",
              lineHeight: 1.4,
              color: "#606060",
            }}
          >
            {post.excerpt}
          </p>
          <MetaLine post={post} />
        </div>
        <div style={{ width: "159px", flexShrink: 0 }}>
          <Thumbnail post={post} variant="list" />
        </div>
      </div>
      <InteractionRow />
    </article>
    </a>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function PostCard({ post, variant = "small", isLast }: PostCardProps) {
  if (variant === "featured") return <FeaturedCard post={post} />;
  if (variant === "list") return <ListCard post={post} isLast={isLast} />;
  return <SmallCard post={post} />;
}
