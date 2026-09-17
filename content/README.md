# Content

Everything on the site comes from the JSON files in this folder, validated at build time
against [`schema.ts`](schema.ts). If a file is invalid, `npm run build` fails with the file
name and the field that is wrong. `npm run content:check` runs the same validation and lists
every unresolved reference and client TODO.

## Ground rules (from the client brief)

- Use only verified facts. Anything the client has not supplied (opening hours, map pin,
  Ahmedabad address, device names, prices, who consults in Ahmedabad) stays **absent** from
  the data. Components render an honest "to be confirmed" state; nothing is invented.
- No claims of "permanent", "100% safe", "guaranteed" or "best in Pune" in body copy.
- State downtime and number of sessions honestly. Mention the locality naturally 2–3 times.

## Files

| File | What it holds |
| --- | --- |
| `site.json` | Brand, tagline, category, positioning, contact, WhatsApp prefill, logo, stats, primary doctor |
| `doctors/*.json` | One file per doctor (`/dr-daksha-patel`) |
| `categories.json` | Treatment categories: skin, laser, injectables, hair, body |
| `treatments/*.json` | One file per treatment → `/treatments/[slug]` |
| `concerns/*.json` | One file per patient concern → `/concerns/[slug]` (phase 2 route) |
| `locations/*.json` | One file per clinic → `/[slug]` landing page (phase 2 route) |
| `lead-options.json` | The client's canonical treatment/concern list for the booking form |
| `pages/*.json` | Page-level copy: home, treatments index, about |
| `faqs.json`, `principles.json`, `technology.json`, `testimonials.json` | Homepage blocks |

## Add a treatment

1. Copy an existing file in `treatments/` to `treatments/<slug>.json`. The file name must equal
   the `slug` field. Slugs and names come from the brief, section 7.1.
2. Set `category` to `skin`, `laser`, `injectables`, `hair` or `body`.
3. Fill every field. Enforced rules:
   - `metaTitle` ≤ 80 chars, pattern `"{Treatment} in Kalyani Nagar, Pune | Skin Essence"`
   - `metaDescription` 50–155 chars, mentions a locality, ends with a call to action
   - `intro` 2–3 paragraphs (mention "MD dermatologist" once), `whoIsItFor` ≥ 2,
     `howItWorks` ≥ 2 steps, `faqs` ≥ 2, `relatedConcerns` ≥ 2, `relatedTreatments` ≥ 3
   - `subTreatments` = pill chips (areas or types), optional
   - `priceFrom` only once the client confirms prices may be published
4. Add the hero image at `public/images/treatments/<slug>.webp` (1200×900) or run
   `npm run images:placeholders` for a labelled placeholder.
5. `npm run content:check`. The page, sitemap entry, footer link, menu entry, category chip and
   OG image are generated automatically.

Related treatments/concerns that are not published yet are skipped by the renderer (and
reported as warnings), so files can reference content that ships later.

## Add a concern

Same pattern in `concerns/`. Title pattern:
`"{Concern} Treatment in Pune by MD Dermatologist | Skin Essence"`. `treatmentSlugs` lists
treatments in priority order.

## Locations and doctors

Exactly one location must have `"isPrimary": true` (Pune). `hours`, `geo`, `mapEmbedUrl`,
`mapLink`, `phone` and `addressLines` are optional: leave them out until the client supplies
them. `doctorSlugs` lists doctors **confirmed** to consult there; Ahmedabad stays empty until
the client confirms who consults, so the site asserts nothing either way.
