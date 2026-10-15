import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { GCLID_COOKIE } from "@/lib/enquiry-shared";
import { cleanGclid, EnquirySchema, forwardToFunnelAgent } from "@/lib/enquiry";

/**
 * POST /api/enquiry: the /lp/treatments enquiry form (docs/BEHAVIOR_SPEC.md).
 *
 * POST only; the body is JSON and nothing personal ever goes in a URL. The
 * lead is validated here, the phone normalised to +91XXXXXXXXXX, then recorded
 * in Funnel Agent server-side. `ok: true` is returned only once Funnel Agent
 * has accepted it, and that response is what the form waits for before
 * firing the GA generate_lead event.
 *
 * The visitor's Funnel Agent id (fa_anon) and the Google Ads click id
 * (se_gclid) come from first-party cookies, so neither the gclid nor the
 * contact details travel through query strings. Names and numbers are never
 * logged.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body must be JSON." }, { status: 400 });
  }

  const parsed = EnquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed.", fields: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  // Honeypot filled: respond as if accepted, record nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const jar = await cookies();
  // No tracking cookie (blocked tag, private window): mint an id so the
  // form_submit event, and the gclid on it, still attach to the lead.
  const anonymousId = jar.get("fa_anon")?.value || `anon-${randomUUID()}`;
  const gclid = cleanGclid(jar.get(GCLID_COOKIE)?.value);
  const referer = request.headers.get("referer");
  // The page URL without its query string: it may carry the gclid, which is stored separately.
  const pageUrl = referer?.split(/[?#]/)[0] || new URL("/lp/treatments", request.url).toString();

  try {
    await forwardToFunnelAgent({
      enquiry: parsed.data,
      anonymousId,
      gclid,
      pageUrl,
      consentAt: new Date().toISOString(),
      forwardedFor: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    });
  } catch (error) {
    console.error("[enquiry] Funnel Agent rejected or unreachable:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ ok: false, error: "Could not record the enquiry." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
