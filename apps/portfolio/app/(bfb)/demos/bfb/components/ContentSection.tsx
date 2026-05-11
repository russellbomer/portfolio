import { PostCard } from "./PostCard";
import { SECTION_POSTS } from "../data";

interface ContentSectionProps {
  heading: string;
  viewAllUrl: string;
}

export function ContentSection({ heading, viewAllUrl }: ContentSectionProps) {
  return (
    <section style={{ borderBottom: "1px solid var(--bfb-border)", padding: "24px 20px" }}>
      {/* Centered inner content — maxWidth matched to hero grid so columns are same width as hero side cards */}
      <div style={{ maxWidth: "1224px", margin: "0 auto" }}>

        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--bfb-text-primary)" }}>
            {heading}
          </h2>
          <a
            href={viewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--bfb-text-secondary)",
              textDecoration: "none",
            }}
          >
            VIEW ALL
          </a>
        </div>

        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 279px)",
            justifyContent: "space-between",
          }}
        >
          {SECTION_POSTS.map((post) => (
            <PostCard key={post.id} post={post} variant="small" />
          ))}
        </div>
      </div>
    </section>
  );
}
