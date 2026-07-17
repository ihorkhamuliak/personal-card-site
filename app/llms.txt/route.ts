import { siteConfig } from "@/site.config";

// llms.txt – a plain-text summary of who you are, aimed at AI crawlers and
// answer engines. Generated from site.config.ts.
export function GET() {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(siteConfig.description);
  lines.push("");

  if (siteConfig.ventures.length > 0) {
    lines.push("## Who they are");
    for (const venture of siteConfig.ventures) {
      lines.push(`- Involved with ${venture.name}, ${venture.description}.`);
    }
    lines.push("");

    for (const venture of siteConfig.ventures) {
      lines.push(`## ${venture.name}`);
      lines.push(venture.description);
      lines.push(`Website: ${venture.url}`);
      lines.push("");
    }
  }

  lines.push("## Links");
  lines.push(`- Website: ${siteConfig.siteUrl}`);
  if (siteConfig.socials.x) lines.push(`- X: ${siteConfig.socials.x}`);
  if (siteConfig.socials.instagram)
    lines.push(`- Instagram: ${siteConfig.socials.instagram}`);
  if (siteConfig.socials.linkedin)
    lines.push(`- LinkedIn: ${siteConfig.socials.linkedin}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
