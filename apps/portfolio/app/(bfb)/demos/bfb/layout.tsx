import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bfb",
});

export const metadata: Metadata = {
  title: "Browns Film Breakdown",
  description: "In-depth Browns film analysis and breakdown.",
};

export default function BFBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style>{`
          :root {
            --bfb-accent: #ff3300;
            --bfb-accent-dark: #e62e00;
            --bfb-accent-20: rgba(255, 51, 0, 0.2);
            --bfb-accent-30: rgba(255, 51, 0, 0.3);
            --bfb-bg: #ffffff;
            --bfb-bg-contrast-1: #f0f0f0;
            --bfb-bg-contrast-2: #dddddd;
            --bfb-bg-contrast-3: #b7b7b7;
            --bfb-bg-contrast-4: #929292;
            --bfb-bg-contrast-5: #515151;
            --bfb-bg-elevated: #ffffff;
            --bfb-bg-elevated-sec: #f0f0f0;
            --bfb-text-primary: #363737;
            --bfb-text-secondary: #757575;
            --bfb-text-tertiary: #b6b6b6;
            --bfb-border: #e6e6e6;
            --bfb-print-on-accent: #ffffff;
          }

          html {
            font-size: 16px;
            background: #ffffff;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: var(--bfb-bg);
            color: var(--bfb-text-primary);
            font-family: var(--font-bfb), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 1rem;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          * {
            box-sizing: border-box;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .bfb-nav-item a:hover {
            background-color: var(--bfb-bg-contrast-1);
          }

          .bfb-icon-btn:hover {
            background-color: var(--bfb-bg-contrast-1) !important;
            border-radius: 4px;
          }


          .bfb-hover-underline:hover {
            text-decoration: underline !important;
          }

          .bfb-interact-btn:hover {
            background-color: var(--bfb-bg-contrast-1) !important;
            border-radius: 4px;
          }

          .bfb-card .bfb-interactions {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease;
          }

          .bfb-card:hover .bfb-interactions {
            opacity: 1;
            pointer-events: auto;
          }

          @keyframes bfb-tooltip-in {
            from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% - 6px)); }
            to   { opacity: 1; transform: translateX(-50%) translateY(-50%); }
          }

          .bfb-upgrade-btn:hover {
            background-color: #e53200 !important;
          }

          .bfb-recommendation:hover {
            background-color: var(--bfb-bg-contrast-1);
          }

          .bfb-subscribed-btn:hover {
            background-color: #ffc2b2 !important;
          }

          .bfb-see-all-btn:hover {
            background-color: var(--bfb-bg-contrast-2) !important;
            color: var(--bfb-bg-contrast-5);
          }

          /* ── Custom scrollbar ── */
          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }


          ::-webkit-scrollbar-thumb {
            background-color: #dedede;
            border-radius: 9999px;
            border: 2px solid transparent;
            background-clip: content-box;
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: #999999;
          }

          ::-webkit-scrollbar-button {
            background-color: transparent;
            height: 14px;
            display: block;
          }

          ::-webkit-scrollbar-button:hover {
            background-color: #dcdcdc;
          }

          /* Hide duplicate arrows */
          ::-webkit-scrollbar-button:vertical:increment:start,
          ::-webkit-scrollbar-button:vertical:decrement:end {
            display: none;
          }

          /* Up arrow (top) */
          ::-webkit-scrollbar-button:vertical:decrement:start {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M4 2 L7 6 L1 6 Z' fill='%23bbbbbb'/%3E%3C/svg%3E");
            background-size: 5px;
            background-repeat: no-repeat;
            background-position: center;
          }

          /* Down arrow (bottom) */
          ::-webkit-scrollbar-button:vertical:increment:end {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M4 6 L7 2 L1 2 Z' fill='%23bbbbbb'/%3E%3C/svg%3E");
            background-size: 5px;
            background-repeat: no-repeat;
            background-position: center;
          }

          ::-webkit-scrollbar-button:vertical:decrement:start:hover {
            background-image:
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M4 2 L7 6 L1 6 Z' fill='%23666666'/%3E%3C/svg%3E"),
              linear-gradient(to bottom, #e8e8e8, transparent);
            background-size: 5px, 100%;
            background-repeat: no-repeat, no-repeat;
            background-position: center, center;
          }

          ::-webkit-scrollbar-button:vertical:increment:end:hover {
            background-image:
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M4 6 L7 2 L1 2 Z' fill='%23666666'/%3E%3C/svg%3E"),
              linear-gradient(to top, #e8e8e8, transparent);
            background-size: 5px, 100%;
            background-repeat: no-repeat, no-repeat;
            background-position: center, center;
          }

        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
