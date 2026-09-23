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
| `doctors/*.json` | One file per doctor. With `"profileOnAbout": true` (Dr. Patel) the profile is the `#doctor` section of `/about` and `/<slug>` redirects there; without it the doctor gets a standalone `/<slug>` page |
| `categories.json` | The client's nine services (plus Medical Dermatology) that group treatments, the menu and the index |
| `treatments/*.json` | One file per treatment → `/treatments/[slug]` |
| `concerns/*.json` | One file per patient concern → `/concerns/[slug]` |
| `locations/*.json` | One file per clinic → `/[slug]` landing page |
| `blog/<slug>.json` + `blog/<slug>.mdx` | One pair per article → `/blog/[slug]`: metadata in JSON, body in MDX |
| `lead-options.json` | The client's canonical treatment/concern list for the booking form |
| `machines/*.json` | One file per machine → `/technology/[slug]`; `location` (pune/ahmedabad), brochure `specs`, `treatmentSlugs`; `published: false` hides a draft |
| `pages/location.json` | The QR wayfinding page at `/location`: building, floor, arrival steps and help copy. See below |
| `pages/popup.json` | The entry popup asking for the visitor's details: copy, timing and reach. See below |
| `pages/*.json` | Page-level copy: home, treatments index, about (clinic story + hero, meta and photo for the merged About/doctor page), contact, concerns index, blog index, privacy-policy, terms |
| `image-credits.md` | Source, photographer and licence of every stock photo; add a row whenever a photo is added |
| `faqs.json`, `principles.json`, `technology.json`, `testimonials.json` | Homepage blocks |

## Add a treatment

1. Copy an existing file in `treatments/` to `treatments/<slug>.json`. The file name must equal
   the `slug` field. Slugs and names come from the brief, section 7.1.
2. Set `category` to one of the slugs in `categories.json` (the client's service list). Set `"published": false` to hide a page without deleting it.
3. Fill every field. Enforced rules:
   - `metaTitle` ≤ 80 chars, pattern `"{Treatment} in Kalyani Nagar, Pune | Skin Essence"`
   - `metaDescription` 50–155 chars, mentions a locality, ends with a call to action
   - `intro` 2–3 paragraphs (mention "MD dermatologist" once), `whoIsItFor` ≥ 2,
     `howItWorks` ≥ 2 steps, `faqs` ≥ 2, `relatedConcerns` ≥ 2, `relatedTreatments` ≥ 3
   - `subTreatments` = pill chips (areas or types), optional
   - `priceFrom` only once the client confirms prices may be published
   - `todo`: list anything still to confirm with the clinic; `npm run content:check` reports it
4. Add the hero image at `public/images/treatments/<slug>.webp` (1200×900) or run
   `npm run images:placeholders` for a labelled placeholder.
5. `npm run content:check`. The page, sitemap entry, footer link, menu entry, category chip and
   OG image are generated automatically.

Related treatments/concerns that are not published yet are skipped by the renderer (and
reported as warnings), so files can reference content that ships later.

## Add a concern

Same pattern in `concerns/`. Title pattern:
`"{Concern} Treatment in Pune by MD Dermatologist | Skin Essence"`. `treatmentSlugs` lists
treatments in priority order. A concern page is 400–700 words across `heroTitle`, `shortDesc`
(≤ 200 chars, used on cards and in the hero), `intro`, `causes`, `howWeTreat` (≥ 2 titled steps),
`selfCare`, `whenToSeeDoctor` and `faqs`. Hero image: `public/images/concerns/<slug>.webp` (1200×900).


## The /location wayfinding page

A printed QR code opens `/location`, which tells the visitor the clinic is on the 21st floor
and how to get there. Edit **`pages/location.json`** to change anything on it:

| Field | What it controls |
| --- | --- |
| `buildingName`, `buildingAka` | The building, and the name Google Maps shows for it |
| `tower`, `unit`, `landmark` | Tower, office numbers and the nearest landmark |
| `floor`, `floorNumber` | "21st Floor" in prose, and the oversized "21" |
| `steps` | The indoor directions. `highlight: true` marks the step that names the floor |
| `mapsNote` | The line that keeps the promise honest: Maps reaches the building, the page reaches the floor |
| `help`, `whatsappMessage` | The "can't find us" block and the prefilled WhatsApp text |
| `locationSlug` | Which clinic in `locations/` supplies the name, address, phone and map link |
| `googleMapsUrl`, `phone`, `whatsapp` | Optional overrides; leave them out to use the clinic's own |

The clinic name, address, phone, WhatsApp number and map link are **not** repeated here. They
come from `locations/<locationSlug>.json` and `site.json`, so this page can never drift from
the rest of the site. `lib/location-config.ts` resolves the two into one object; the page and
its components read only that, and hide any action whose link is missing rather than rendering
a dead button.

## The entry popup

`pages/popup.json` drives the dialog that asks visitors for their details. It reuses the
site's own lead form, so it posts to the same endpoint, obeys the same validation and carries
the same WhatsApp consent box.

| Field | What it controls |
| --- | --- |
| `enabled` | `false` renders nothing at all and ships no dialog code to the browser |
| `delaySeconds` | How long after the page loads it opens |
| `repeatAfterDays` | How long someone who closed or sent it is left alone. `0` asks every visit |
| `excludePaths` | Routes it never interrupts, matched as prefixes. `/location` is excluded because a QR visitor standing outside the building needs directions, not a form |
| `eyebrow`, `title`, `description`, `dismissLabel`, `footnote` | The copy |

**A dialog that covers the page seconds after it opens is what Google calls an intrusive
interstitial**, and it can cost mobile rankings on a site whose whole build is search-led. If
enquiries matter more than rankings, keep it. If rankings dip, raise `delaySeconds`, raise
`repeatAfterDays`, or set `enabled` to `false`. All three are content changes.

## Add a blog post

1. `blog/<slug>.json`: `title`, `metaTitle` (`"{Post title} | Skin Essence Pune"`), `metaDescription`,
   `date` (ISO), `excerpt`, `author`, optional `reviewedBy` and `readingMinutes`, `heroImage`,
   `relatedTreatments`, `relatedConcerns`.
2. `blog/<slug>.mdx`: the body in Markdown. Start at `##` headings (the page supplies the H1) and
   link to treatment and concern pages inline.
3. Only name Dr. Patel as `author` or `reviewedBy` once she has actually written or reviewed the post.

## Locations and doctors

Exactly one location must have `"isPrimary": true` (Pune). `hours`, `geo`, `mapEmbedUrl`,
`mapLink`, `phone` and `addressLines` are optional: leave them out until the client supplies
them. `mapQuery` is search text that Google resolves to a single pin (the building in the
verified address); it drives the keyless map embed and the Directions link until the clinic's
own place link arrives. `heroTitle`, `metaDescription` and `faqs` feed the landing page; doctors
also need `heroTitle` and `metaDescription`. `doctorSlugs` lists doctors **confirmed** to consult there; Ahmedabad stays empty until
the client confirms who consults, so the site asserts nothing either way.
