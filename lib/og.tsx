import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "./seo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OgInput = { eyebrow: string; title: string; subtitle?: string; footer?: string };

let logoDataUrl: string | null | undefined;

/** The brand mark, embedded as a data URL so the OG renderer needs no network. */
function getLogoDataUrl(): string | null {
  if (logoDataUrl !== undefined) return logoDataUrl;
  try {
    const file = path.join(process.cwd(), "public", "images", "brand", "logo-160.png");
    logoDataUrl = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
  } catch {
    logoDataUrl = null;
  }
  return logoDataUrl;
}

/** Shared 1200×630 Open Graph card: teal gradient, logo + wordmark, eyebrow, title, subtitle. */
export function renderOgImage({ eyebrow, title, subtitle, footer }: OgInput) {
  const long = title.length > 48;
  const logo = getLogoDataUrl();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #1d909a 0%, #106d76 48%, #08444a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" width={64} height={72} style={{ width: 64, height: 72 }} />
            )}
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>{SITE_NAME}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, opacity: 0.9 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#6fc0c8" }} />
            <div>{eyebrow}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: long ? 58 : 70, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1020 }}>
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 26, lineHeight: 1.35, opacity: 0.85, maxWidth: 900 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, opacity: 0.75 }}>
          <div>{footer ?? "Dr. Daksha Patel, MBBS, MD (Skin & VD)"}</div>
          <div>{SITE_URL.replace(/^https?:\/\/(www\.)?/, "")}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
