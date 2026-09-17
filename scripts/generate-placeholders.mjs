/**
 * Generates gradient placeholder WebP images for every image slot the site
 * references but the client has not yet supplied, so the layout renders with
 * correct aspect ratios. Each image is labelled with the subject it should be
 * replaced with. Re-run any time: `npm run images:placeholders`.
 *
 * Real assets already in place (never overwritten by this script):
 *   public/images/brand/logo.png, public/images/doctor/dr-daksha-patel.webp,
 *   public/images/hero/home.webp (doctor photo from the existing site).
 *
 * Replace a placeholder by dropping a real WebP of the same size at the same
 * path (or update the src/width/height in the content file).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "images");

const PALETTES = {
  teal: { from: "#157f89", to: "#08444a", ink: "#ffffff", glow: "#6fc0c8" },
  "teal-light": { from: "#6fc0c8", to: "#157f89", ink: "#ffffff", glow: "#eaf6f6" },
  mist: { from: "#e3ebeb", to: "#bfd3d4", ink: "#0c5860", glow: "#ffffff" },
  sand: { from: "#efe6da", to: "#d9c6b0", ink: "#4a3b2c", glow: "#ffffff" },
  blush: { from: "#f3e3dd", to: "#dcbcb1", ink: "#5a3b33", glow: "#ffffff" },
  slate: { from: "#4d6467", to: "#1f3335", ink: "#ffffff", glow: "#6fc0c8" },
};

// Slugs from the brief (section 7.1 / 7.2).
const treatments = [
  "acne-treatment", "acne-scar-treatment", "pigmentation-treatment", "melasma-treatment",
  "chemical-peel", "skin-glow-treatment", "skin-tightening-treatment", "anti-ageing-treatment", "bridal-skin-care",
  "paediatric-dermatology", "laser-toning", "laser-hair-removal", "tattoo-removal",
  "botox", "dermal-fillers", "hair-transplant", "prp-hair-treatment", "hair-loss-treatment",
  "fat-reduction", "mole-and-wart-removal", "signature-mira-peel",
];
const concerns = [
  "acne", "acne-scars", "pigmentation", "dark-circles", "hair-fall", "unwanted-hair",
  "dull-skin", "wrinkles-and-fine-lines", "open-pores", "stretch-marks", "child-skin-problems",
];
const categories = ["laser-hair-reduction", "skin-glow", "skin-tightening", "acne-and-scars", "pigmentation", "fat-reduction", "hair-regrowth", "anti-ageing", "mole-and-wart-removal", "medical-dermatology"];
const tech = ["mirapeel", "qyros-nd-yag", "coolite-bolt", "fractional-co2-laser", "hifu", "mnrf", "coolsculpting"];

const cycle = (list) => (i) => list[i % list.length];
const warm = cycle(["mist", "sand", "teal-light", "blush", "slate", "teal"]);

const manifest = [
  { file: "hero/treatments.webp", w: 1200, h: 1000, label: "Treatment room", palette: "slate" },
  { file: "clinic/reception.webp", w: 1200, h: 900, label: "Clinic reception", palette: "mist" },
  { file: "clinic/consultation.webp", w: 1200, h: 900, label: "Consultation room", palette: "sand" },
  { file: "clinic/laser-room.webp", w: 1200, h: 900, label: "Laser room", palette: "teal" },
  ...categories.map((slug, i) => ({ file: `categories/${slug}.webp`, w: 800, h: 600, label: `Category · ${slug}`, palette: warm(i) })),
  ...treatments.map((slug, i) => ({ file: `treatments/${slug}.webp`, w: 1200, h: 900, label: `Treatment · ${slug}`, palette: warm(i + 1) })),
  ...concerns.map((slug, i) => ({ file: `concerns/${slug}.webp`, w: 1200, h: 900, label: `Concern · ${slug}`, palette: warm(i + 2) })),
  ...tech.map((slug, i) => ({ file: `tech/${slug}.webp`, w: 800, h: 600, label: `Machine · ${slug}`, palette: warm(i + 3) })),
  ...[1, 2, 3, 4].map((n, i) => ({ file: `testimonials/patient-${n}.webp`, w: 800, h: 800, label: `Patient photo ${n}`, palette: i % 2 ? "blush" : "sand" })),
  { file: "tiles/injectables.webp", w: 1200, h: 600, label: "Tile · Botox & Dermal Fillers", palette: "mist" },
  { file: "locations/pune.webp", w: 1200, h: 800, label: "Kalyani Nagar clinic", palette: "teal" },
  { file: "locations/ahmedabad.webp", w: 1200, h: 800, label: "Ahmedabad clinic", palette: "slate" },
];

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svgFor({ w, h, label, palette }) {
  const p = PALETTES[palette];
  label = esc(label);
  const fontSize = Math.round(Math.min(w, h) * 0.045);
  const pad = Math.round(Math.min(w, h) * 0.06);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.from}"/>
      <stop offset="1" stop-color="${p.to}"/>
    </linearGradient>
    <radialGradient id="r1" cx="0.8" cy="0.2" r="0.6">
      <stop offset="0" stop-color="${p.glow}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${p.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="r2" cx="0.15" cy="0.9" r="0.5">
      <stop offset="0" stop-color="${p.glow}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${p.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#r1)"/>
  <rect width="${w}" height="${h}" fill="url(#r2)"/>
  <g stroke="${p.ink}" stroke-opacity="0.08" stroke-width="${Math.max(2, w * 0.004)}">
    <line x1="${w * 0.55}" y1="-10" x2="${w * 1.1}" y2="${h * 0.7}"/>
    <line x1="${w * 0.7}" y1="-10" x2="${w * 1.25}" y2="${h * 0.7}"/>
  </g>
  <circle cx="${w * 0.78}" cy="${h * 0.32}" r="${Math.min(w, h) * 0.22}" fill="${p.glow}" fill-opacity="0.12"/>
  <text x="${pad}" y="${h - pad}" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="500" fill="${p.ink}" fill-opacity="0.8">${label}</text>
  <text x="${pad}" y="${h - pad - fontSize * 1.5}" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(fontSize * 0.7)}" fill="${p.ink}" fill-opacity="0.55">PLACEHOLDER · replace with photo</text>
</svg>`;
}

// Real photos already in place (from the clinic). The generator skips these.
const REAL = new Set([
  "hero/home.webp", "hero/treatments.webp", "doctor/dr-daksha-patel.webp", "doctor/consultation.webp",
  "treatments/botox.webp", "treatments/dermal-fillers.webp", "locations/ahmedabad.webp", "clinic/reception.webp",
  "treatments/acne-treatment.webp", "treatments/chemical-peel.webp", "treatments/laser-hair-removal.webp", "treatments/skin-glow-treatment.webp",
  "treatments/hair-transplant.webp", "treatments/hair-loss-treatment.webp", "treatments/bridal-skin-care.webp", "tiles/injectables.webp",
  "treatments/skin-tightening-treatment.webp", "treatments/fat-reduction.webp", "treatments/mole-and-wart-removal.webp", "treatments/pigmentation-treatment.webp",
  "treatments/signature-mira-peel.webp",
  "tech/mirapeel.webp", "tech/qyros-nd-yag.webp", "tech/coolite-bolt.webp", "tech/fractional-co2-laser.webp", "tech/hifu.webp", "tech/mnrf.webp", "tech/coolsculpting.webp",
]);

let written = 0;
for (const item of manifest) {
  if (REAL.has(item.file)) continue;
  const out = path.join(OUT, item.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svgFor(item))).webp({ quality: 78 }).toFile(out);
  written += 1;
}
console.log(`Wrote ${written} placeholder images to public/images`);
