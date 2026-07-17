import { siteConfig } from "@/site.config";

// Downloadable vCard at /contact.vcf, generated from site.config.ts.
export function GET() {
  const nameParts = siteConfig.name.trim().split(/\s+/);
  const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const givenName =
    nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : siteConfig.name;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${familyName};${givenName};;;`,
    `FN:${siteConfig.name}`,
  ];

  const [firstVenture, ...otherVentures] = siteConfig.ventures;
  if (firstVenture) {
    lines.push(`ORG:${firstVenture.name}`);
  }
  lines.push(`TITLE:${siteConfig.jobTitle}`);
  if (siteConfig.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${siteConfig.email}`);
  }
  lines.push(`URL;TYPE=PREF:${siteConfig.siteUrl}`);
  otherVentures.forEach((venture, i) => {
    lines.push(`item${i + 1}.URL:${venture.url}`);
    lines.push(`item${i + 1}.X-ABLabel:${venture.name}`);
  });
  if (siteConfig.socials.x) {
    lines.push(`X-SOCIALPROFILE;TYPE=twitter:${siteConfig.socials.x}`);
  }
  if (siteConfig.socials.linkedin) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${siteConfig.socials.linkedin}`);
  }
  if (siteConfig.socials.instagram) {
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:${siteConfig.socials.instagram}`);
  }
  lines.push(`NOTE:${siteConfig.bio}`);
  lines.push("END:VCARD");

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contact.vcf"',
    },
  });
}
