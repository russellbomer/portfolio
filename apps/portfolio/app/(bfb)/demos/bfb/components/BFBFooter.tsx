export function BFBFooter() {
  return (
    <footer
      style={{
        padding: "40px 20px",
        textAlign: "center",
        fontSize: "15px",
        color: "var(--bfb-text-secondary)",
        backgroundColor: "var(--bfb-bg-contrast-1)",
        borderTop: "1px solid var(--bfb-border)",
      }}
    >
      © 2026 Browns Film Breakdown&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="https://www.brownsfilmbreakdown.com/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Privacy</a>
      &nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="https://www.brownsfilmbreakdown.com/tos" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Terms</a>
      &nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="https://www.brownsfilmbreakdown.com/privacy#collection-notice" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Collection notice</a>
    </footer>
  );
}
