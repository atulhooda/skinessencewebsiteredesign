/**
 * Build-time content loaders.
 *
 * Reads JSON from /content, validates it against the zod schemas in
 * content/schema.ts and cross-checks references (category slugs, related
 * treatments, concern → treatment links, doctor ↔ location links). Everything
 * is memoised per process, so calling these helpers from many pages costs one
 * disk read per file.
 *
 * This module has no React or Next.js imports so it can also run from
 * `scripts/validate-content.ts`. Import `lib/content.ts` from app code, which
 * adds the `server-only` guard.
 */
import fs from "node:fs";
import path from "node:path";
import { z, type ZodType } from "zod";
import {
  AboutPageSchema,
  BlogPostSchema,
  ConcernSchema,
  DoctorSchema,
  FaqGroupSchema,
  HomePageSchema,
  LeadOptionSchema,
  LocationSchema,
  PrincipleSchema,
  SiteSchema,
  TechnologyFileSchema,
  TestimonialsFileSchema,
  TreatmentCategorySchema,
  TreatmentSchema,
  TreatmentsPageSchema,
  type AboutPage,
  type BlogPost,
  type Concern,
  type Doctor,
  type FaqGroup,
  type HomePage,
  type Image,
  type LeadOption,
  type Location,
  type Principle,
  type Site,
  type Technology,
  type Testimonial,
  type Treatment,
  type TreatmentCategory,
  type TreatmentsPage,
} from "../content/schema.ts";

const CONTENT_DIR = path.join(process.cwd(), "content");

const memo = new Map<string, unknown>();

/** In development, skip the cache so edits to content JSON show on the next refresh. */
const CACHE = process.env.NODE_ENV !== "development";

function memoised<T>(key: string, compute: () => T): T {
  if (CACHE && memo.has(key)) return memo.get(key) as T;
  const value = compute();
  memo.set(key, value);
  return value;
}

function readJson(file: string): unknown {
  const full = path.join(CONTENT_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (error) {
    throw new Error(`Could not read content file "${file}": ${(error as Error).message}`);
  }
}

function parseWith<T>(schema: ZodType<T>, raw: unknown, label: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid content in ${label}:\n${issues}`);
  }
  return result.data;
}

function loadFile<T>(file: string, schema: ZodType<T>): T {
  return memoised(`file:${file}`, () => parseWith(schema, readJson(file), file));
}

function loadDir<T extends { slug: string }>(dir: string, schema: ZodType<T>): T[] {
  return memoised(`dir:${dir}`, () => {
    const full = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(full)) return [];
    return fs
      .readdirSync(full)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => {
        const item = parseWith(schema, readJson(path.join(dir, f)), `${dir}/${f}`);
        const expected = f.replace(/\.json$/, "");
        if (item.slug !== expected) {
          throw new Error(`Slug mismatch in ${dir}/${f}: file is named "${expected}" but slug is "${item.slug}"`);
        }
        return item;
      });
  });
}

/* ---------- Site-wide ---------- */

export function getSite(): Site {
  return memoised("site:validated", () => {
    const site = loadFile("site.json", SiteSchema);
    if (!getDoctor(site.primaryDoctor)) {
      throw new Error(`site.json: primaryDoctor "${site.primaryDoctor}" has no file in content/doctors.`);
    }
    return site;
  });
}

export function getHomePage(): HomePage {
  return loadFile("pages/home.json", HomePageSchema);
}

export function getTreatmentsPage(): TreatmentsPage {
  return loadFile("pages/treatments.json", TreatmentsPageSchema);
}

export function getAboutPage(): AboutPage {
  return loadFile("pages/about.json", AboutPageSchema);
}

export function getFaqGroups(): FaqGroup[] {
  return loadFile("faqs.json", z.array(FaqGroupSchema));
}

export function getTestimonials(): Testimonial[] {
  return loadFile("testimonials.json", TestimonialsFileSchema).items;
}

export function getPrinciples(): Principle[] {
  return loadFile("principles.json", z.array(PrincipleSchema));
}

export function getTechnology(): Technology[] {
  return loadFile("technology.json", TechnologyFileSchema).items;
}

export function getTechnologyDisclaimer(): string | undefined {
  return loadFile("technology.json", TechnologyFileSchema).disclaimer;
}

/** The client's canonical treatment/concern list for the lead form dropdown. */
export function getLeadOptions(): LeadOption[] {
  return loadFile("lead-options.json", z.array(LeadOptionSchema));
}

/* ---------- Doctors ---------- */

export function getDoctors(): Doctor[] {
  return loadDir("doctors", DoctorSchema);
}

export function getDoctor(slug: string): Doctor | undefined {
  return getDoctors().find((d) => d.slug === slug);
}

export function getPrimaryDoctor(): Doctor {
  const site = loadFile("site.json", SiteSchema);
  const doctor = getDoctor(site.primaryDoctor);
  if (!doctor) throw new Error(`Primary doctor "${site.primaryDoctor}" not found in content/doctors.`);
  return doctor;
}

/* ---------- Treatments ---------- */

export function getCategories(): TreatmentCategory[] {
  return [...loadFile("categories.json", z.array(TreatmentCategorySchema))].sort((a, b) => a.order - b.order);
}

export function getTreatments(): Treatment[] {
  return memoised("treatments:validated", () => {
    const treatments = loadDir("treatments", TreatmentSchema);
    const categorySlugs = new Set(getCategories().map((c) => c.slug));
    for (const t of treatments) {
      if (!categorySlugs.has(t.category)) {
        throw new Error(`treatments/${t.slug}.json: unknown category "${t.category}". Add it to content/categories.json.`);
      }
    }
    const categoryOrder = new Map(getCategories().map((c) => [c.slug, c.order]));
    return treatments.filter((t) => t.published).sort((a, b) => {
      const byCategory = (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0);
      if (byCategory !== 0) return byCategory;
      return a.order !== b.order ? a.order - b.order : a.name.localeCompare(b.name);
    });
  });
}

export function getTreatment(slug: string): Treatment | undefined {
  return getTreatments().find((t) => t.slug === slug);
}

export type CategoryWithTreatments = TreatmentCategory & { treatments: Treatment[] };

/** Categories that have at least one published treatment, in display order. */
export function getTreatmentsByCategory(): CategoryWithTreatments[] {
  const treatments = getTreatments();
  return getCategories()
    .map((category) => ({ ...category, treatments: treatments.filter((t) => t.category === category.slug) }))
    .filter((category) => category.treatments.length > 0);
}

export type FeaturedTile = { treatment: Treatment; name: string; href: string; image?: Image; subline?: string };

/** Homepage tiles from pages/home.json → treatments.featured, in order, skipping any treatment not published. */
export function getFeaturedTiles(): FeaturedTile[] {
  const treatments = getTreatments();
  const tiles: FeaturedTile[] = [];
  for (const entry of getHomePage().treatments.featured) {
    const item = typeof entry === "string" ? { slug: entry } : entry;
    const treatment = treatments.find((t) => t.slug === item.slug);
    if (!treatment) continue;
    tiles.push({ treatment, name: item.name ?? treatment.name, href: item.href ?? `/treatments/${treatment.slug}`, image: item.image, subline: item.subline ?? treatment.subTreatments.slice(0, 4).join(" · ") });
  }
  return tiles;
}

export function getCategory(slug: string): TreatmentCategory | undefined {
  return getCategories().find((c) => c.slug === slug);
}

/**
 * Up to `limit` related treatments: declared relations first, then others in
 * the same category, then anything else. Only published treatments are
 * returned, so the page never links to a slug that has no content yet.
 */
export function getRelatedTreatments(treatment: Treatment, limit = 3): Treatment[] {
  const all = getTreatments().filter((t) => t.slug !== treatment.slug);
  const bySlug = new Map(all.map((t) => [t.slug, t]));
  const picked: Treatment[] = [];
  const seen = new Set<string>();
  const push = (t: Treatment | undefined) => {
    if (t && !seen.has(t.slug) && picked.length < limit) {
      seen.add(t.slug);
      picked.push(t);
    }
  };
  treatment.relatedTreatments.forEach((slug) => push(bySlug.get(slug)));
  all.filter((t) => t.category === treatment.category).forEach(push);
  all.forEach(push);
  return picked;
}

/* ---------- Concerns ---------- */

export function getConcerns(): Concern[] {
  return loadDir("concerns", ConcernSchema);
}

export function getConcern(slug: string): Concern | undefined {
  return getConcerns().find((c) => c.slug === slug);
}

/** Up to `limit` published concerns declared on the treatment. */
export function getRelatedConcerns(treatment: Treatment, limit = 2): Concern[] {
  const concerns = getConcerns();
  return treatment.relatedConcerns
    .map((slug) => concerns.find((c) => c.slug === slug))
    .filter((c): c is Concern => Boolean(c))
    .slice(0, limit);
}

/** Published treatments for a concern, in the concern's priority order. */
export function getTreatmentsForConcern(concern: Concern): Treatment[] {
  const treatments = getTreatments();
  return concern.treatmentSlugs
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter((t): t is Treatment => Boolean(t));
}

/* ---------- Locations ---------- */

export function getLocations(): Location[] {
  return memoised("locations:validated", () => {
    const locations = loadDir("locations", LocationSchema);
    const doctorSlugs = new Set(getDoctors().map((d) => d.slug));
    for (const l of locations) {
      for (const slug of l.doctorSlugs) {
        if (!doctorSlugs.has(slug)) throw new Error(`locations/${l.slug}.json: unknown doctor "${slug}".`);
      }
    }
    return [...locations].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  });
}

export function getPrimaryLocation(): Location {
  const primary = getLocations().find((l) => l.isPrimary);
  if (!primary) throw new Error("No location has isPrimary: true in content/locations.");
  return primary;
}

export function getLocation(slug: string): Location | undefined {
  return getLocations().find((l) => l.slug === slug);
}

/** Doctors confirmed to consult at a location (empty when the client has not confirmed). */
export function getDoctorsForLocation(location: Location): Doctor[] {
  return location.doctorSlugs.map((slug) => getDoctor(slug)).filter((d): d is Doctor => Boolean(d));
}

/* ---------- Blog ---------- */

export function getBlogPosts(): BlogPost[] {
  return [...loadDir("blog", BlogPostSchema)].sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

/* ---------- Cross-reference report ---------- */

export type ContentReport = {
  counts: Record<string, number>;
  /** Links to content that does not exist yet, plus client TODOs. Not fatal. */
  warnings: string[];
};

export function buildContentReport(): ContentReport {
  const treatments = getTreatments();
  const concerns = getConcerns();
  const treatmentSlugs = new Set(treatments.map((t) => t.slug));
  const concernSlugs = new Set(concerns.map((c) => c.slug));
  const warnings: string[] = [];
  const imageExists = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

  for (const t of loadDir("treatments", TreatmentSchema).filter((x) => !x.published)) warnings.push(`treatments/${t.slug}: unpublished (page, links and sitemap entry hidden)`);
  for (const t of treatments) {
    for (const todo of t.todo) warnings.push(`treatments/${t.slug}: TODO ${todo}`);
    for (const slug of t.relatedTreatments) {
      if (!treatmentSlugs.has(slug)) warnings.push(`treatments/${t.slug}: related treatment "${slug}" is not published yet`);
    }
    for (const slug of t.relatedConcerns) {
      if (!concernSlugs.has(slug)) warnings.push(`treatments/${t.slug}: related concern "${slug}" is not published yet`);
    }
    if (!imageExists(t.heroImage.src)) warnings.push(`treatments/${t.slug}: hero image ${t.heroImage.src} is missing from /public`);
  }
  for (const c of concerns) {
    for (const slug of c.treatmentSlugs) {
      if (!treatmentSlugs.has(slug)) warnings.push(`concerns/${c.slug}: treatment "${slug}" is not published yet`);
    }
    if (!imageExists(c.heroImage.src)) warnings.push(`concerns/${c.slug}: hero image ${c.heroImage.src} is missing from /public`);
  }
  for (const l of getLocations()) {
    if (!l.hours) warnings.push(`locations/${l.slug}: opening hours not provided (rendered as "to be confirmed")`);
    if (!l.addressLines.length) warnings.push(`locations/${l.slug}: address not provided`);
    if (!l.geo) warnings.push(`locations/${l.slug}: no geo coordinates (omitted from MedicalClinic schema)`);
    for (const todo of l.todo) warnings.push(`locations/${l.slug}: TODO ${todo}`);
  }
  for (const d of getDoctors()) {
    if (!imageExists(d.photo.src)) warnings.push(`doctors/${d.slug}: photo ${d.photo.src} is missing from /public`);
  }
  const tech = loadFile("technology.json", TechnologyFileSchema);
  if (tech._note) warnings.push(`technology.json: ${tech._note}`);
  const testimonials = loadFile("testimonials.json", TestimonialsFileSchema);
  if (testimonials._note) warnings.push(`testimonials.json: ${testimonials._note}`);

  return {
    counts: {
      categories: getCategories().length,
      treatments: treatments.length,
      concerns: concerns.length,
      locations: getLocations().length,
      doctors: getDoctors().length,
      blogPosts: getBlogPosts().length,
      faqGroups: getFaqGroups().length,
      testimonials: getTestimonials().length,
      leadOptions: getLeadOptions().length,
    },
    warnings,
  };
}
