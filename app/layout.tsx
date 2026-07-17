import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { siteConfig } from "@/site.config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Manrope замість DM Sans: та сама змінна --font-dm-sans, але з кирилицею
// (DM Sans не має cyrillic-сабсету, укр текст падав би у системний фолбек).
const manrope = Manrope({
  variable: "--font-dm-sans",
  subsets: ["latin", "cyrillic"],
});

const TITLE = `${siteConfig.name} – ${siteConfig.jobTitle}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: TITLE,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
  openGraph: {
    type: "profile",
    url: siteConfig.siteUrl,
    title: TITLE,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

// Person structured data (JSON-LD), built from site.config.ts and rendered
// into the document so search engines and AI answer engines resolve a single
// clear Person entity.
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  ...(siteConfig.alternateNames.length > 0 && {
    alternateName: siteConfig.alternateNames,
  }),
  jobTitle: siteConfig.jobTitle,
  description: siteConfig.description,
  url: siteConfig.siteUrl,
  ...(siteConfig.nationality && {
    nationality: { "@type": "Country", name: siteConfig.nationality },
  }),
  sameAs: [
    ...Object.values(siteConfig.socials).filter(Boolean),
    ...siteConfig.ventures.map((v) => v.url),
  ],
  ...(siteConfig.ventures.length > 0 && {
    worksFor: siteConfig.ventures.map((v) => ({
      "@type": "Organization",
      name: v.name,
      url: v.url,
      description: v.description,
    })),
    founder: siteConfig.ventures.map((v) => ({
      "@type": "Organization",
      name: v.name,
      url: v.url,
    })),
  }),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
        {children}
      </body>
    </html>
  );
}
