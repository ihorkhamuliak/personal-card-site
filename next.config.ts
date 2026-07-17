import type { NextConfig } from "next";
import { siteConfig } from "./site.config";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up stray lockfiles in parent
  // directories when inferring the project root.
  turbopack: {
    root: __dirname,
  },
  // Static portfolio page lives in public/portfolio/index.html; serve it at
  // the clean /portfolio URL.
  async rewrites() {
    return [
      {
        source: "/portfolio",
        destination: "/portfolio/index.html",
      },
    ];
  },
  // Canonical domain: funnel the auto-assigned *.vercel.app host to the custom
  // domain so only your domain serves the site. Only active once vercelHost is
  // filled in site.config.ts (Vercel keeps the .vercel.app name assigned; this
  // makes it redirect rather than serve).
  async redirects() {
    if (!siteConfig.vercelHost) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: siteConfig.vercelHost }],
        destination: `${siteConfig.siteUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
