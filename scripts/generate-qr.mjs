/**
 * Prints the QR code for the location page.
 *
 *   npm run qr                                  → <NEXT_PUBLIC_SITE_URL or the canonical domain>/location
 *   npm run qr -- https://example.com/location  → any URL you pass
 *
 * The QR encodes the PAGE, never a Google Maps link, so the floor, the arrival
 * steps and the phone numbers can all change without reprinting. Whatever you
 * print has to keep working for years, so generate it against the domain the
 * site will actually live on.
 *
 * Writes public/qr/location-qr.svg (vector, for print) and
 * public/qr/location-qr.png (2048px, for anyone who needs a raster).
 */
import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://skinessence2017.com").replace(/\/+$/, "");
const url = process.argv[2] ?? `${origin}/location`;

if (!/^https?:\/\//.test(url)) {
  console.error(`Not a URL: ${url}\nUsage: npm run qr -- https://your-domain.com/location`);
  process.exit(1);
}

const outDir = path.join(process.cwd(), "public", "qr");
fs.mkdirSync(outDir, { recursive: true });

// Level Q survives a scuffed or partly covered print; margin 4 is the quiet
// zone scanners need. Near-black on white keeps contrast high on paper.
const options = {
  errorCorrectionLevel: "Q",
  margin: 4,
  color: { dark: "#052d31ff", light: "#ffffffff" },
};

const svgPath = path.join(outDir, "location-qr.svg");
const pngPath = path.join(outDir, "location-qr.png");

fs.writeFileSync(svgPath, await QRCode.toString(url, { ...options, type: "svg" }));
await QRCode.toFile(pngPath, url, { ...options, type: "png", width: 2048 });

console.log(`QR code for ${url}`);
console.log(`  ${path.relative(process.cwd(), svgPath)}  (vector — use this for print)`);
console.log(`  ${path.relative(process.cwd(), pngPath)}  (2048px PNG)`);
console.log("Print at 2.5cm or larger, keep the white border, and scan it once before it goes to press.");
