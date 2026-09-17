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
  concerns/*.json         One file per patient concern → /concerns/[slug] (phase 2 route)
  locations/*.json        One file per clinic → /[slug] landing page (phase 2 route)
  pages/*.json            Page-level copy (home, treatments index)
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
public/images/            Placeholder WebPs (labelled). Replace with real photos, same paths.
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
- Device / technology names → `content/technology.json` (currently technique names, flagged with `_note`)
- Clinic interior photos → replace labelled placeholders in `public/images/` (the doctor photo and logo are real)
- Before/after images with written consent → results section (not built yet)
- Instagram and other social handles → `content/site.json` → `social`, `doctors/*.json` → `sameAs`
- Whether to publish starting prices → `priceFrom` on treatments (currently omitted)
- Breast Reshaping: kept as a form option only; no page until the client confirms scope
- GTM container ID → `NEXT_PUBLIC_GTM_ID` (slot in `components/layout/Gtm.tsx`)
- `content/testimonials.json` holds SAMPLE testimonials for layout; replace with consented Google reviews
- Wire `app/api/lead/route.ts` to the follow-up backend (currently validates and logs)

## Redirects from the old WordPress site

Configured in `next.config.ts`: `/about/`, `/know-your-doctor/`, `/clinic/`, `/services/` → new routes.
`/#Services` is a hash link and cannot be redirected server-side (the homepage `#treatments` anchor covers it).
