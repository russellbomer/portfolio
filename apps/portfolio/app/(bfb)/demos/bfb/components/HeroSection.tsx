import { PostCard } from "./PostCard";
import { HERO_POSTS } from "../data";

const DIVIDER: React.CSSProperties = {
  borderTop: "1px solid var(--bfb-border)",
  margin: "16px 0",
};

const COL_DIVIDER: React.CSSProperties = {
  width: "1px",
  backgroundColor: "var(--bfb-border)",
  flexShrink: 0,
  alignSelf: "stretch",
};

export function HeroSection() {
  const [topLeft, bottomLeft, featured, topRight, bottomRight] = HERO_POSTS;

  return (
    <section
      style={{
          padding: "20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "283fr 1px 600fr 1px 283fr",
          maxWidth: "1242px",
          margin: "0 auto",
        }}
      >
        {/* Left column */}
        <div style={{ paddingRight: "20px" }}>
          <PostCard post={topLeft} variant="small" />
          <div style={DIVIDER} />
          <PostCard post={bottomLeft} variant="small" />
        </div>

        <div style={COL_DIVIDER} />

        {/* Center — featured */}
        <div style={{ padding: "0 20px" }}>
          <PostCard post={featured} variant="featured" />
        </div>

        <div style={COL_DIVIDER} />

        {/* Right column */}
        <div style={{ paddingLeft: "20px" }}>
          <PostCard post={topRight} variant="small" />
          <div style={DIVIDER} />
          <PostCard post={bottomRight} variant="small" />
        </div>
      </div>
    </section>
  );
}
