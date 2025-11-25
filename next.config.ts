// CONSTRAINT: Keep architecture portable (DigitalOcean now, Hetzner later)
// NICE: Add SEO metadata defaults when implementing placeholders
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid requiring a dev dep in production
    ignoreDuringBuilds: true,
  },
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true,
  },
};

export default nextConfig;
