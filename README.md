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
| `npm run qr` | Regenerate the printable QR code for `/location` (see **QR code** below) |
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
  [slug]/                 Data-driven landing pages: one per clinic location (and any doctor with a standalone profile)
  about/                  About the clinic AND Dr. Patel's profile (#doctor); /dr-daksha-patel redirects here
  contact/                Contact page
  location/               QR wayfinding page: building, 21st floor and indoor directions
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
  doctors/*.json          One file per doctor. `profileOnAbout: true` (Dr. Patel) = profile is the #doctor
                          section of /about; otherwise a standalone /[slug] page
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
- Photos: every published page has a real photo (doctor and clinic photos from the client, brochure crops, and Pexels stock logged in `content/image-credits.md`). Labelled placeholders remain only for unpublished pages (tattoo removal, the four Ahmedabad machines)
- Kalyani Nagar reception photo: the client's file is only 718x536, upscaled to 1200x800 for the site. Ask for the full-resolution original, and for more Pune interior photos (treatment rooms, IV lounge) so the Pune pages are not carried by one image
- The Kalyani Nagar signage reads "Laser · IV Lounge · Regenerative Clinic", two service lines the client's list omits and the site therefore never mentions; confirm whether IV therapy and regenerative treatments are offered
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
- Re-run `npm run qr` against the live domain before any QR code is printed, and confirm the arrival steps in `content/pages/location.json` with the clinic (security desk, lift bank, parking)
- `/dr-daksha-patel` → `/about` is a temporary (307) redirect while the client reviews the merged page; set `permanent: true` in `next.config.ts` at launch

## QR code

A printed QR code points at **`/location`**, never at a Google Maps URL. Maps can only take
someone to the building; the page is what tells them the clinic is on the 21st floor. Because
the QR encodes the page, the floor, the arrival steps, the map link and the phone numbers can
all change later without reprinting anything.

```bash
npm run qr                                    # https://skinessence2017.com/location
npm run qr -- https://other-domain.com/location
```

Writes `public/qr/location-qr.svg` (use this for print) and a 2048px PNG. Error correction is
level Q with the standard quiet zone, so it survives a scuffed print. **Generate it against the
domain the site will actually launch on and scan the proof before it goes to press** — the
committed file encodes `skinessence2017.com`, which only works once that domain serves this
site. `qrcode` is a devDependency used by the script only; nothing ships to the browser.

Everything the page renders comes from `content/pages/location.json` plus the clinic's own
files, resolved once in `lib/location-config.ts`. Nothing is hardcoded in the components.

## Blog

A post is two files in `content/blog/`: `<slug>.json` (title, meta, date, excerpt, author, hero image, related treatment and concern slugs) and `<slug>.mdx` (the body, plain Markdown; internal links like `[text](/treatments/laser-hair-removal)` become client-side links). The index, sitemap entry, OG image and `BlogPosting` JSON-LD are generated. Title pattern: `"{Post title} | Skin Essence Pune"`.

## Machine pages

`/technology` lists every published machine by clinic and `/technology/[slug]` is one page per device, generated from `content/machines/*.json`. Specs come from the manufacturers' brochures the clinic forwarded (cited on the page). The four Ahmedabad machines (D'Laze, Alice Super Bubble, Galaxy-1064, Mermaid) are drafted with `published: false` until their clinic photos are saved to `public/images/_incoming/` and placed.

## Redirects from the old WordPress site

Configured in `next.config.ts`: `/about/`, `/know-your-doctor/` (→ `/about`), `/clinic/`, `/services/` → new routes.
The About and doctor pages were merged (Sep 2026): `/dr-daksha-patel` forwards to `/about`, generated from `profileOnAbout` in `content/doctors/*.json`. Link to a doctor with `doctorHref()` from `lib/links.ts`, never a hard-coded path.
`/#Services` is a hash link and cannot be redirected server-side (the homepage `#treatments` anchor covers it).
