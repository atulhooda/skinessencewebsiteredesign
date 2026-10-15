/**
 * The /lp/treatments enquiry form: constants shared by the form (client) and
 * POST /api/enquiry (server). Behaviour is specified in docs/BEHAVIOR_SPEC.md.
 */

export const CALLBACK_TIMES = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export type CallbackTime = (typeof CALLBACK_TIMES)[number]["value"];

/** Shown directly above the submit button and stored verbatim with the lead. */
export const ENQUIRY_CONSENT_TEXT = "We will use these details only to contact you about your enquiry.";

/** First-party cookie holding the Google Ads click ID for offline conversion upload. */
export const GCLID_COOKIE = "se_gclid";
export const GCLID_MAX_AGE_DAYS = 90;
/** gclids are URL-safe base64-ish tokens; anything else is ignored rather than stored. */
export const GCLID_PATTERN = /^[A-Za-z0-9_-]{1,200}$/;

/**
 * Indian mobile number → "+91XXXXXXXXXX", or null if it is not one.
 * Accepts 10 digits with or without +91 / 91 / 0 in front; spaces, dashes,
 * dots and brackets are ignored. The 10-digit number must start with 6–9.
 */
export function normaliseIndianMobile(input: string): string | null {
  let digits = String(input).replace(/[\s\-().]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}
