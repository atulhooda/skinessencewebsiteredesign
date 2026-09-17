/**
 * Content schema for Skin Essence.
 *
 * Every page on the site is generated from JSON files in /content that are
 * validated against these zod schemas at build time (see lib/content.ts).
 * A malformed file fails `next build` with a readable error instead of
 * shipping a broken page.
 *
 * Facts that the client has not supplied (opening hours, map pin, Ahmedabad
 * address, device names, prices) are modelled as OPTIONAL fields and left
 * out of the data rather than invented. Components render an honest
 * "to be confirmed" state when they are absent.
 */
import { z } from "zod";

/* ---------- Shared primitives ---------- */

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

export const ImageSchema = z.object({
  /** Path under /public, e.g. "/images/treatments/acne-treatment.webp" */
  src: z.string().startsWith("/"),
  /** Descriptive alt text. Empty string only for purely decorative images. */
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const FaqSchema = z.object({
  q: z.string().min(8),
  a: z.string().min(20),
});

/** Title patterns from the brief (section 6.4). Google shows ~60 chars; hard cap 80. */
export const MetaTitleSchema = z.string().min(10).max(80);

/** Google truncates descriptions at roughly 155 characters. Hard limit here. */
export const MetaDescriptionSchema = z.string().min(50).max(155);

export const DayOfWeekSchema = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

/** One entry per day, 24h "HH:MM". Consecutive days with equal times are grouped for display. */
export const OpeningHoursSchema = z.object({
  day: DayOfWeekSchema,
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
});

const PhoneSchema = z.string().regex(/^\+\d{10,15}$/, "E.164, e.g. +919157731020");
const WhatsAppSchema = z.string().regex(/^\d{10,15}$/, "digits only, e.g. 919157731020");

/* ---------- Treatments ---------- */

export const TreatmentCategorySchema = z.object({
  /** One of: skin, laser, injectables, hair, body (brief section 8). */
  slug: SlugSchema,
  name: z.string(),
  /** One-line description shown in the category row. */
  shortDesc: z.string().max(160),
  image: ImageSchema,
  /** Lower numbers render first. */
  order: z.number().int(),
  /** Optional visual accent for the "View Treatments" button (e.g. urgent care). */
  accent: z.enum(["default", "urgent"]).default("default"),
});

export const TreatmentSchema = z.object({
  slug: SlugSchema,
  name: z.string(),
  /** Must match a slug in content/categories.json (checked at load time). */
  category: SlugSchema,
  /** One sentence, used on cards. */
  shortDesc: z.string().max(200),
  /** H1 */
  heroTitle: z.string(),
  /** Pattern: "{Treatment} in Kalyani Nagar, Pune | Skin Essence" */
  metaTitle: MetaTitleSchema,
  /** < 155 chars, includes a locality and a call to action. */
  metaDescription: MetaDescriptionSchema,
  /** 2–3 body paragraphs rendered under "Overview". */
  intro: z.array(z.string()).min(1),
  whoIsItFor: z.array(z.string()).min(2),
  howItWorks: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .min(2),
  sessionsAndDowntime: z.object({
    sessions: z.string(),
    sessionTime: z.string(),
    downtime: z.string(),
    results: z.string(),
  }),
  aftercare: z.array(z.string()).default([]),
  /** Indicative starting price in INR. Only set once the client confirms publishing prices. */
  priceFrom: z.number().int().positive().optional(),
  faqs: z.array(FaqSchema).min(2),
  /** Concern slugs. Page renders up to 2. */
  relatedConcerns: z.array(SlugSchema).min(1),
  /** Treatment slugs. Page renders up to 3 that exist. */
  relatedTreatments: z.array(SlugSchema).min(3),
  heroImage: ImageSchema,
  /** Pill chips, e.g. ["Full Face", "Underarms", "Full Body"]. */
  subTreatments: z.array(z.string()).default([]),
  /** false hides the page, links, sitemap entry and menu item without deleting the file. */
  published: z.boolean().default(true),
  /** Position within its category on the index and menu; lower first. The service's main page is 1. */
  order: z.number().int().default(100),
  /** Facts still to confirm with the clinic; reported by `npm run content:check`. */
  todo: z.array(z.string()).default([]),
});

/* ---------- Concerns ---------- */

export const ConcernSchema = z.object({
  slug: SlugSchema,
  name: z.string(),
  /** Pattern: "{Concern} Treatment in Pune by MD Dermatologist | Skin Essence" */
  metaTitle: MetaTitleSchema,
  metaDescription: MetaDescriptionSchema,
  /** Intro paragraphs. */
  intro: z.array(z.string()).min(1),
  causes: z.array(z.string()).min(2),
  /** Treatment slugs that address this concern, in priority order. */
  treatmentSlugs: z.array(SlugSchema).min(1),
  faqs: z.array(FaqSchema).min(1),
  heroImage: ImageSchema,
});

/* ---------- Locations ---------- */

export const LocationSchema = z.object({
  /** Doubles as the route: /dermatologist-in-kalyani-nagar */
  slug: SlugSchema,
  /** Display name, e.g. "Skin Essence, Kalyani Nagar" */
  name: z.string(),
  city: z.string(),
  area: z.string(),
  isPrimary: z.boolean().default(false),
  /** Street address lines. Empty array = address not yet supplied (rendered as "to be confirmed"). */
  addressLines: z.array(z.string()).default([]),
  postalCode: z.string().optional(),
  /** State, e.g. "Maharashtra" */
  region: z.string().optional(),
  country: z.string().default("IN"),
  /** Falls back to the site-wide contact details when omitted. */
  phone: PhoneSchema.optional(),
  whatsapp: WhatsAppSchema.optional(),
  email: z.string().email().optional(),
  /** Google Maps embed URL from the client. TODO for both clinics. */
  mapEmbedUrl: z.string().url().optional(),
  /** Google Maps place URL. When absent the UI links to a Maps search for the address. */
  mapLink: z.string().url().optional(),
  /** TODO from client. Absent = "Opening hours to be confirmed". */
  hours: z.array(OpeningHoursSchema).optional(),
  nearbyAreas: z.array(z.string()).default([]),
  /** TODO from client. Absent = no geo in MedicalClinic schema. */
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
  /** Doctors confirmed to consult here. Empty = not confirmed; the UI asserts nothing. */
  doctorSlugs: z.array(SlugSchema).default([]),
  heroImage: ImageSchema,
  intro: z.array(z.string()).min(1),
  /** Anything still to be confirmed with the clinic before launch. */
  todo: z.array(z.string()).default([]),
});

/* ---------- Doctors ---------- */

export const DoctorSchema = z.object({
  /** Doubles as the route: /dr-daksha-patel */
  slug: SlugSchema,
  name: z.string(),
  /** e.g. ["MBBS", "MD (Skin & VD)"] */
  qualifications: z.array(z.string()).min(1),
  title: z.string(),
  yearsExperience: z.number().int(),
  /** e.g. "Expertise. Experience. Personalised Care." */
  subheading: z.string().optional(),
  shortBio: z.string(),
  bio: z.array(z.string()).min(1),
  specialInterests: z.array(z.string()).min(1),
  photo: ImageSchema,
  /** Location slugs where this doctor is confirmed to consult. */
  locationSlugs: z.array(SlugSchema).default([]),
  sameAs: z.array(z.string().url()).default([]),
});

/* ---------- Site-wide ---------- */

export const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
  /** Compact wording for inline pills, e.g. "of experience". */
  short: z.string().optional(),
  icon: z.enum(["calendar", "users", "sparkle", "clock"]).default("sparkle"),
});

export const SiteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  /** "Your Skin. Our Expertise." */
  tagline: z.string(),
  /** "Advanced Skin, Hair, Laser & Cosmetic Clinic" */
  category: z.string(),
  /** "MD Dermatologist in Kalyani Nagar, Pune" */
  positioning: z.string(),
  /** "Women and men" */
  serves: z.string(),
  description: z.string(),
  domain: z.string(),
  phone: PhoneSchema,
  whatsapp: WhatsAppSchema,
  /** Prefilled WhatsApp message (brief 9.9). */
  whatsappPrefill: z.string(),
  email: z.string().email(),
  logo: ImageSchema,
  /** Single-colour (white) version of the mark for dark backgrounds such as the header. */
  logoMono: ImageSchema.optional(),
  /** Social profiles. TODO from client. */
  social: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  stats: z.array(StatSchema).min(3),
  /** Slug of the doctor featured on the homepage and in schema.org markup. */
  primaryDoctor: SlugSchema,
});

/** Options for the lead form's treatment/concern dropdown — the client's own canonical list. */
export const LeadOptionSchema = z.object({
  value: z.string().min(1).max(80),
  label: z.string().min(1).max(80),
});

export const TestimonialSchema = z.object({
  quote: z.string().min(40),
  patient: z.string(),
  treatment: z.string(),
  /** 1–5 */
  rating: z.number().int().min(1).max(5),
  image: ImageSchema,
});

export const TestimonialsFileSchema = z.object({
  _note: z.string().optional(),
  items: z.array(TestimonialSchema).min(1),
});

export const FaqGroupSchema = z.object({
  category: z.string(),
  items: z.array(FaqSchema).min(1),
});

export const PrincipleSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const TechnologySchema = z.object({
  name: z.string(),
  description: z.string(),
  image: ImageSchema,
  /** Confirmed machines are ordered first. */
  highlight: z.boolean().default(false),
  /** Which clinic the photo shows; rendered as the tile badge. Omit for representative stock photos. */
  location: z.enum(["pune", "ahmedabad"]).optional(),
  /** Rooms rather than machines get a wide tile and no location-ordering priority. */
  kind: z.enum(["machine", "room"]).default("machine"),
  /** Slug in content/machines; makes the tile link to that machine's page. */
  machine: SlugSchema.optional(),
});

/* ---------- Machines (one page per device at /technology/[slug]) ---------- */

export const MachineSchema = z.object({
  slug: SlugSchema,
  name: z.string(),
  /** Short label for cards and chips, e.g. "Coolite BOLT". */
  shortName: z.string(),
  manufacturer: z.string(),
  distributor: z.string().optional(),
  /** Clinic where the unit is installed. */
  location: z.enum(["pune", "ahmedabad"]),
  category: z.enum(["laser", "skin", "body"]),
  /** One-line device class, e.g. "High-power triple-wavelength diode laser". */
  kicker: z.string(),
  heroTitle: z.string(),
  metaTitle: MetaTitleSchema,
  metaDescription: MetaDescriptionSchema,
  shortDesc: z.string().max(220),
  intro: z.array(z.string()).min(1),
  whatItTreats: z.array(z.string()).min(2),
  howItWorks: z.array(z.object({ title: z.string(), description: z.string() })).min(2),
  /** Facts from the manufacturer's brochure. */
  specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  /** Treatment slugs performed on this machine. */
  treatmentSlugs: z.array(SlugSchema).default([]),
  faqs: z.array(FaqSchema).min(2),
  image: ImageSchema,
  /** Where the specs and photo came from; rendered as a small line under the specs. */
  sources: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  order: z.number().int().default(100),
  todo: z.array(z.string()).default([]),
});

export const TechnologyFileSchema = z.object({
  _note: z.string().optional(),
  /** Small line rendered under the grid, e.g. while stock photos stand in for the clinic's own. */
  disclaimer: z.string().optional(),
  items: z.array(TechnologySchema),
});

const SectionCopySchema = z.object({ eyebrow: z.string(), title: z.string() });

export const HomePageSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    /** H1. Must contain "MD Dermatologist" (brief 5.6). */
    title: z.string(),
    subtitle: z.string(),
    primaryCta: z.string(),
    secondaryCta: z.string(),
    image: ImageSchema,
  }),
  /** Patient form under the hero, headed by the two-tone statement. */
  intake: z.object({ eyebrow: z.string(), lead: z.string(), rest: z.string() }),
  treatments: SectionCopySchema.extend({
    /**
     * Homepage tiles, in order. Each is a treatment slug, or an object with the
     * slug (for the image + default link) plus an optional display name and href
     * override, e.g. { "slug": "laser-hair-removal", "name": "Laser Treatments", "href": "/treatments#laser" }.
     */
    featured: z
      .array(
        z.union([
          SlugSchema,
          z.object({
            slug: SlugSchema,
            name: z.string().optional(),
            href: z.string().startsWith("/").optional(),
            /** Tile image override; defaults to the treatment's heroImage. */
            image: ImageSchema.optional(),
            /** One-line list of techniques under the name; defaults to the treatment's subTreatments. */
            subline: z.string().optional(),
          }),
        ]),
      )
      .min(1)
      .max(12),
  }),
  doctorIntro: SectionCopySchema,
  whyChoose: SectionCopySchema.extend({ image: ImageSchema }),
  testimonials: SectionCopySchema,
  technology: SectionCopySchema.extend({ description: z.string() }),
  faq: SectionCopySchema,
  locations: SectionCopySchema,
  leadForm: SectionCopySchema.extend({ description: z.string() }),
});

export const TreatmentsPageSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    image: ImageSchema,
  }),
  listing: SectionCopySchema,
  faq: SectionCopySchema,
});

/** Copy for /about, lifted from the existing site (brief section 3.8). */
export const AboutPageSchema = z.object({
  approach: z.object({ title: z.string(), intro: z.string(), focus: z.array(z.string()).min(1) }),
  vision: z.object({ title: z.string(), text: z.string() }),
  whyChoose: z.object({ title: z.string(), text: z.string() }),
  understanding: z.object({ title: z.string(), paragraphs: z.array(z.string()).min(1) }),
  services: z.array(z.string()).min(1),
});

/* ---------- Blog (MDX body lives alongside the frontmatter file) ---------- */

export const BlogPostSchema = z.object({
  slug: SlugSchema,
  title: z.string(),
  /** Pattern: "{Post title} | Skin Essence Pune" */
  metaTitle: MetaTitleSchema,
  metaDescription: MetaDescriptionSchema,
  /** ISO date, e.g. "2026-09-01" */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  excerpt: z.string(),
  author: z.string(),
  heroImage: ImageSchema,
  /** Treatment / concern slugs to link from the post footer. */
  relatedTreatments: z.array(SlugSchema).default([]),
  relatedConcerns: z.array(SlugSchema).default([]),
});

/* ---------- Inferred types ---------- */

export type Image = z.infer<typeof ImageSchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;
export type OpeningHours = z.infer<typeof OpeningHoursSchema>;
export type TreatmentCategory = z.infer<typeof TreatmentCategorySchema>;
export type Treatment = z.infer<typeof TreatmentSchema>;
export type Concern = z.infer<typeof ConcernSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Doctor = z.infer<typeof DoctorSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type LeadOption = z.infer<typeof LeadOptionSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type FaqGroup = z.infer<typeof FaqGroupSchema>;
export type Principle = z.infer<typeof PrincipleSchema>;
export type Technology = z.infer<typeof TechnologySchema>;
export type Machine = z.infer<typeof MachineSchema>;
export type HomePage = z.infer<typeof HomePageSchema>;
export type TreatmentsPage = z.infer<typeof TreatmentsPageSchema>;
export type AboutPage = z.infer<typeof AboutPageSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
