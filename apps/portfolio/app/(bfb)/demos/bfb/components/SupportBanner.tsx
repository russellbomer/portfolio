export function SupportBanner() {
  return (
    <section
      style={{
        backgroundColor: "var(--bfb-bg-contrast-1)",
        minHeight: "135px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "38px",
      }}
    >
      <span
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "var(--bfb-text-primary)",
        }}
      >
        We appreciate your support!
      </span>
      <a
        href="https://www.brownsfilmbreakdown.com/subscribe"
        target="_blank"
        rel="noopener noreferrer"
        className="bfb-upgrade-btn"
        style={{
          backgroundColor: "var(--bfb-accent)",
          color: "var(--bfb-print-on-accent)",
          borderRadius: "7px",
          padding: "0 16px",
          height: "36px",
          fontSize: "14px",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        Upgrade to founding
      </a>
    </section>
  );
}
