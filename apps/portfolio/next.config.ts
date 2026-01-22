// CONSTRAINT: Keep architecture portable (DigitalOcean now, Hetzner later)
// NICE: Add SEO metadata defaults when implementing placeholders
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true,
  },
  eslint: {
    // ESLint 9 has a circular JSON warning with Next.js - ignore during builds
    // Linting still runs in editor and via `npm run lint`
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        // When accessing quarry subdomain root, serve terminal demo
        source: "/",
        destination: "/demos/terminal",
        has: [
          {
            type: "host",
            value: "quarry.russellbomer.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
