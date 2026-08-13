import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    // "/" is the portfolio (see rewrites in next.config.ts).
    { url: `${siteConfig.siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.siteUrl}/en/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.siteUrl}/start`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.siteUrl}/en/start`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.siteUrl}/card`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
