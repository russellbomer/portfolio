import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint 9 has a circular JSON warning with Next.js - ignore during builds
    // Linting still runs in editor and via `npm run lint`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
