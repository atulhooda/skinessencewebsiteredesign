import "server-only";
import { z } from "zod";
import { CALLBACK_TIMES, ENQUIRY_CONSENT_TEXT, GCLID_PATTERN, normaliseIndianMobile } from "./enquiry-shared";
import { LEAD_LIMITS } from "./lead-shared";

/** Server-side validation for POST /api/enquiry. Mirrors the checks in components/lp/EnquiryForm. */
export const EnquirySchema = z.object({
  name: z.string().trim().min(LEAD_LIMITS.nameMin).max(LEAD_LIMITS.nameMax),
  phone: z
    .string()
    .transform((v, ctx) => {
      const phone = normaliseIndianMobile(v);
      if (!phone) ctx.addIssue({ code: "custom", message: "Enter a valid 10-digit Indian mobile number" });
      return phone ?? z.NEVER;
    }),
  callbackTime: z.enum(CALLBACK_TIMES.map((t) => t.value) as [string, ...string[]]),
  /** Honeypot. Humans never fill it. */
  website: z.string().optional(),
});

export type Enquiry = z.infer<typeof EnquirySchema>;

/** Funnel Agent ingestion. The write key is public (it ships in the browser tag); these are server-side calls with it. */
const FUNNEL_API = process.env.FUNNEL_API ?? process.env.NEXT_PUBLIC_FUNNEL_API ?? "https://track.skinessence2017.com";
const FUNNEL_KEY = process.env.FUNNEL_KEY ?? process.env.NEXT_PUBLIC_FUNNEL_KEY ?? "wk_52e3aff27656e23165691b6a";
/** Funnel Agent's tenant key. Every lead from this site carries it, the same value the browser tag sends. */
const FUNNEL_SITE_ID = process.env.FUNNEL_SITE_ID ?? "default";

export function cleanGclid(value: string | undefined): string | null {
  return value && GCLID_PATTERN.test(value) ? value : null;
}

type ForwardInput = {
  enquiry: Enquiry;
  anonymousId: string;
  gclid: string | null;
  pageUrl: string;
  consentAt: string;
  /** Passed through so Funnel Agent's geo and device details describe the visitor, not this server. */
  forwardedFor: string | null;
  userAgent: string | null;
};

async function post(path: string, body: unknown, extraHeaders: Record<string, string>): Promise<void> {
  const res = await fetch(`${FUNNEL_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Site-Id": FUNNEL_SITE_ID, ...(FUNNEL_KEY ? { "X-Write-Key": FUNNEL_KEY } : {}), ...extraHeaders },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Funnel Agent ${path} responded ${res.status}`);
}

/**
 * Record the enquiry in Funnel Agent: /identify creates or updates the lead
 * (name, normalised phone, consent timestamp and source), then a form_submit
 * event on the same anonymous id carries the callback time, the consent record
 * and the gclid. Funnel Agent attaches that event to the lead, which is where
 * an offline conversion upload reads the gclid from.
 *
 * whatsapp_opt_in is deliberately left unset: the consent line covers a call
 * back about this enquiry only, and Funnel Agent uses whatsapp_opt_in to send
 * automated WhatsApp messages.
 */
export async function forwardToFunnelAgent({ enquiry, anonymousId, gclid, pageUrl, consentAt, forwardedFor, userAgent }: ForwardInput): Promise<void> {
  const headers: Record<string, string> = {};
  if (forwardedFor) headers["X-Forwarded-For"] = forwardedFor;
  if (userAgent) headers["User-Agent"] = userAgent;

  await post(
    "/identify",
    {
      anonymous_id: anonymousId,
      name: enquiry.name,
      phone: enquiry.phone,
      consent_timestamp: consentAt,
      consent_source: "form:lp_treatments",
    },
    headers,
  );
  await post(
    "/track",
    {
      event_type: "form_submit",
      anonymous_id: anonymousId,
      url: pageUrl,
      timestamp: consentAt,
      metadata: {
        form: "lp_treatments",
        fields: { callback_time: enquiry.callbackTime },
        consent: true,
        consent_at: consentAt,
        consent_text: ENQUIRY_CONSENT_TEXT,
        ...(gclid ? { gclid } : {}),
      },
    },
    headers,
  );
}
