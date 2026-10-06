import type { NextConfig } from "next";
import { siteConfig } from "./site.config";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up stray lockfiles in parent
  // directories when inferring the project root.
  turbopack: {
    root: __dirname,
  },
  // Static pages live in public/<name>/index.html; serve them at clean URLs.
  // The portfolio is the landing page: "/" serves it directly, and the
  // business card moved to /card (app/card/page.tsx). Both rewrites below work
  // because no filesystem route owns "/" or "/en" any more.
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/portfolio/index.html",
      },
      {
        source: "/en",
        destination: "/en/portfolio/index.html",
      },
      {
        source: "/portfolio",
        destination: "/portfolio/index.html",
      },
      {
        source: "/start",
        destination: "/start/index.html",
      },
      {
        source: "/p/proces",
        destination: "/p/proces/index.html",
      },
      {
        source: "/privacy",
        destination: "/privacy/index.html",
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
  // Security headers for every route, static public/ pages included. No full
  // CSP on purpose: the lead form uses an inline script and Vercel Analytics,
  // so only frame-ancestors is set (nothing embeds this site in an iframe).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
