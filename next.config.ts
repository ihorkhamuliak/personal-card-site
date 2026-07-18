import type { NextConfig } from "next";
import { siteConfig } from "./site.config";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up stray lockfiles in parent
  // directories when inferring the project root.
  turbopack: {
    root: __dirname,
  },
  // Static pages live in public/<name>/index.html; serve them at clean URLs.
  async rewrites() {
    return [
      {
        source: "/portfolio",
        destination: "/portfolio/index.html",
      },
      {
        source: "/start",
        destination: "/start/index.html",
      },
      {
        source: "/en/portfolio",
        destination: "/en/portfolio/index.html",
      },
      {
        source: "/en/start",
        destination: "/en/start/index.html",
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
