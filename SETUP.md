# Setup – make this site yours

Everything personal lives in one file: `site.config.ts` at the project root.
The pages, the SEO metadata, the Person structured data, `robots.txt`,
`sitemap.xml`, `llms.txt`, and the downloadable contact card at `/contact.vcf`
are all generated from it. You should not need to edit any component.

## Steps

1. Run `npm install`.

2. Open `site.config.ts` and replace every placeholder: name, handle, job
   title, bio, description, email, `siteUrl` (your domain, no trailing slash),
   social links, and your ventures/companies. Leave any social link or the
   ventures list empty to hide that part of the card.

3. Swap the placeholder assets in `public/` – keep the same file names:
   - `public/avatar.png` – your profile photo (square, 512px or larger)
   - `public/og-image.png` – social share image, 1200x630
   - `public/favicon.png` – browser tab icon, 64x64 or larger

4. Run `npm run dev` and check http://localhost:3000. Also confirm
   `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/contact.vcf` show your
   domain and details – they are generated from `site.config.ts` automatically.

5. Deploy to Vercel (import the repo at vercel.com) and connect your own
   domain.

6. Optional, after deploying: set `vercelHost` in `site.config.ts` to the
   auto-assigned host (e.g. `my-site.vercel.app`) so it permanently redirects
   to your custom domain. Leave it empty until your domain is connected.

## If you are using Claude Code

Open this folder in Claude Code and say: "Read SETUP.md and personalize this
site for me" – then answer its questions and drop your photo into `public/`.
