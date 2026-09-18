# Skin Essence — website

Static Next.js 15 (App Router) site for **Skin Essence**, MD Dermatologist in Kalyani Nagar, Pune.
Every page is generated from typed content in [`/content`](content/) — there is no CMS and no hand-written page copy.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server on http://localhost:3000 |
| `npm run build` | Production build (validates content, fails on schema or SEO errors) |
| `npm run start` | Serve the production build |
| `npm run content:check` | Validate every file in `/content` and list unresolved references / TODOs |
| `npm run images:placeholders` | Regenerate gradient placeholder images for every image slot |
| `npm run check` | content check + typecheck + lint + build |

## Structure

```
app/                      Routes. Each page composes section components and reads /content.
  layout.tsx              Header, footer, sticky mobile bar, next/font Inter, metadataBase
  page.tsx                Homepage
  treatments/             Index grouped by category + [slug] template
  concerns/               Index + [slug] template (causes, how we treat it, self-care, FAQs)
  technology/             Machines index + [slug] template
  [slug]/                 Data-driven landing pages: one per clinic location and one per doctor
  about/, contact/        About and contact pages
  blog/                   Index + [slug]; post bodies are MDX files in /content/blog
  privacy-policy/, terms/ Legal pages from content/pages/*.json
  */opengraph-image.tsx   1200×630 OG images generated with next/og, per route
  sitemap.ts, robots.ts   Auto sitemap.xml and robots.txt
  api/lead/route.ts       POST /api/lead — validates and logs (stub for your backend)
components/
  ui/                     Button, Chip, Eyebrow, SectionCard, SectionHeading, StatCard, icons…
  layout/                 Header (+ full-screen menu), Footer, StickyBar
  sections/               Reusable page sections (hero, treatments list, doctor, accordion,
                          testimonial slider, tech mosaic, FAQ, lead form, locations…)
  seo/JsonLd.tsx          Renders schema.org JSON-LD
content/
  schema.ts               zod schemas + TypeScript types for every content type
  site.json               Brand, contact, doctor, stats
  categories.json         Treatment categories (order, image, blurb)
  treatments/*.json       One file per treatment → /treatments/[slug]
  concerns/*.json         One file per patient concern → /concerns/[slug]
  locations/*.json        One file per clinic → /[slug] landing page
  doctors/*.json          One file per doctor → /[slug] profile page
  machines/*.json         One file per machine → /technology/[slug]
  blog/<slug>.json + .mdx One pair per article → /blog/[slug] (metadata + MDX body)
  pages/*.json            Page-level copy (home, treatments, about, contact, concerns, blog, privacy-policy, terms)
  image-credits.md        Source and licence of every stock photo
  faqs.json, testimonials.json, principles.json, technology.json
lib/
  content-core.ts         fs + zod loaders, cross-reference checks, related-item helpers
  content.ts              server-only entry point used by app code
  seo.ts                  buildMetadata(), canonical/OG defaults, title helpers
  schema-org.ts           MedicalClinic, Physician, MedicalProcedure, FAQPage, BreadcrumbList…
  links.ts                Route builders, tel/WhatsApp links
  og.tsx                  Shared OG image renderer
scripts/
  validate-content.ts     Backs `npm run content:check`
  generate-placeholders.mjs
mdx-components.tsx        Tailwind styles for MDX blog bodies
public/images/            Real photos (clinic, doctor, brochures, Pexels; see content/image-credits.md).
                          Labelled placeholders remain only for unpublished pages.
```

## Static export vs. the lead endpoint

All pages are prerendered (`generateStaticParams`, no dynamic APIs), so the project is
`output: "export"` compatible. The one exception is `POST /api/lead`, which needs a serverless
function. On Vercel leave `output` unset (default) and the route deploys as a function. If you
ever move the lead endpoint elsewhere, uncomment `output: "export"` in `next.config.ts`.

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to the real origin before launch; it drives
canonicals, the sitemap, robots and JSON-LD.

## Before launch (open items from the brief, section 11)

Run `npm run content:check` — every TODO below is also reported there. None of these values
are invented in the data; the site renders "to be confirmed" states until they arrive.

- Pune opening hours → `content/locations/dermatologist-in-kalyani-nagar.json` → `hours`
- Google Maps place URL / Place ID (Pune) → `mapLink`, `mapEmbedUrl`, and `NEXT_PUBLIC_GOOGLE_PLACE_ID` for the reviews slot
- Ahmedabad address, hours and who consults there → `content/locations/dermatologist-in-ahmedabad.json` (phone confirmed: +91 98259 71010; the reception / lounge / laser-room photos are the Ahmedabad clinic)
- Machine brand/model names and photos for the Pune clinic → `content/technology.json` (grid lists the technology types from the client's services graphic with representative Pexels photos and a "photos are representative" line; swap in the clinic's own photos and remove `disclaimer` in technology.json)
- Signature Mira Peel (MiraPeel system, confirmed): confirm the clinic's standard protocol and pricing → `content/treatments/signature-mira-peel.json` → `todo`
- Pune machines confirmed with brochures: MiraPeel, Qyros Q-switched Nd:YAG, Coolite BOLT diode laser, BVLASER 8+9 hydra facial machine (brochure photos in use). HIFU, MNRF, CoolSculpting and Fractional CO2 still unconfirmed (representative photos)
- Tattoo removal: the Qyros supports it but it is not on the client's service list; page stays unpublished until confirmed
- BOLT Tightening (Coolite BOLT skin-tightening protocol): not confirmed as offered; not on the site
- Photos: every published page now has a real photo (doctor and Ahmedabad clinic photos from the client, brochure crops, and Pexels stock logged in `content/image-credits.md`). There are no Pune clinic interior photos yet, so the Kalyani Nagar cards use Dr. Patel's portrait. Labelled placeholders remain only for unpublished pages (tattoo removal, the four Ahmedabad machines)
- Map: until the clinic sends its own Google Maps place link, the embed and Directions button pin the building (`mapQuery` = "Bramhacorp Business Park, New Kalyani Nagar, Pune 411014"), not the clinic's listing
- Blog: the two seed articles were written by the agency and carry the byline "Skin Essence Editorial Team". Have Dr. Patel review them, then set `reviewedBy` (and `author` if she wishes) in `content/blog/*.json`; the site does not claim her authorship or review until then
- Privacy policy and terms (`content/pages/privacy-policy.json`, `terms.json`) are general drafts; have the clinic or its legal adviser review them before launch
- About page: the "What we offer" list is verbatim from the brief and still mentions hair transplant and tattoo removal, which the client's later service list omits; confirm and edit `content/pages/about.json`
- Before/after images with written consent → results section (not built yet)
- Instagram and other social handles → `content/site.json` → `social`, `doctors/*.json` → `sameAs`
- Whether to publish starting prices → `priceFrom` on treatments (currently omitted)
- Hair Transplant and Tattoo Removal are unpublished (redirected) because the client's Sep 2026 service list omits them; confirm before deleting or restoring
- Breast Reshaping: not in the client's service list; no page and no form option
- GTM container ID → `NEXT_PUBLIC_GTM_ID` (slot in `components/layout/Gtm.tsx`)
- `content/testimonials.json` holds SAMPLE testimonials for layout; replace with consented Google reviews
- Wire `app/api/lead/route.ts` to the follow-up backend (currently validates and logs)

## Blog

A post is two files in `content/blog/`: `<slug>.json` (title, meta, date, excerpt, author, hero image, related treatment and concern slugs) and `<slug>.mdx` (the body, plain Markdown; internal links like `[text](/treatments/laser-hair-removal)` become client-side links). The index, sitemap entry, OG image and `BlogPosting` JSON-LD are generated. Title pattern: `"{Post title} | Skin Essence Pune"`.

## Machine pages

`/technology` lists every published machine by clinic and `/technology/[slug]` is one page per device, generated from `content/machines/*.json`. Specs come from the manufacturers' brochures the clinic forwarded (cited on the page). The four Ahmedabad machines (D'Laze, Alice Super Bubble, Galaxy-1064, Mermaid) are drafted with `published: false` until their clinic photos are saved to `public/images/_incoming/` and placed.

## Redirects from the old WordPress site

Configured in `next.config.ts`: `/about/`, `/know-your-doctor/`, `/clinic/`, `/services/` → new routes.
`/#Services` is a hash link and cannot be redirected server-side (the homepage `#treatments` anchor covers it).
