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
};

export default nextConfig;
