import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      // Scenario links made before the gauge moved off the root (PRD U-1) keep working; the query passes through.
      { source: "/", has: [{ type: "query", key: "venue" }], destination: "/gauge", permanent: false },
      { source: "/", has: [{ type: "query", key: "size" }], destination: "/gauge", permanent: false },
      // How it works is now a section of the landing page.
      { source: "/how-it-works", destination: "/#how-it-works", permanent: false },
    ];
  },
};

export default nextConfig;
