import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  /** former URLs keep working after the 2026 restructuring */
  async redirects() {
    return [
      { source: "/communication", destination: "/communications", permanent: true },
      { source: "/methodes", destination: "/outils", permanent: true },
      { source: "/a-propos", destination: "/parcours", permanent: true },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
