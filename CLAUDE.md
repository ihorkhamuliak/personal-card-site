@AGENTS.md

# Personalizing this template

All personal content (name, bio, links, domain, asset paths) lives in
`site.config.ts` at the project root. To personalize the site, follow
`SETUP.md` – edit only `site.config.ts` and swap the images in `public/`.
Do not hardcode personal data into components; everything reads from the
config, including the generated `robots.txt`, `sitemap.xml`, `llms.txt`,
and `/contact.vcf`.
