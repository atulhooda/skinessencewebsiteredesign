import Script from "next/script";

/**
 * Funnel Agent analytics (added at the client's request, 23 Sep 2026).
 *
 * One tag records page views, clicks and time on page, and captures the
 * booking form. `data-capture-forms` is what turns form capture on.
 *
 * What leaves the browser on submit, verified against their track.js:
 * name, phone, email, the WhatsApp consent checkbox, and the visible text of
 * any <select> — for this site that is the treatment/concern and the clinic.
 * Free text is NOT sent, so the patient's message about their condition stays
 * between them and the clinic. Our honeypot field ("website") is recognised
 * and bot submissions are dropped.
 *
 * Served from the clinic's own subdomain. That endpoint only accepts requests
 * from https://skinessence2017.com, so on any other origin (the Vercel staging
 * URL included) the script loads but its requests are refused, and nothing is
 * recorded until the real domain serves this site.
 *
 * The key is a publishable client-side key, not a secret. Set
 * NEXT_PUBLIC_FUNNEL_KEY to "" to switch tracking off, or to another key to
 * point at a different workspace. Add `data-fa-no-capture` to any <form> that
 * should never be captured.
 */
const API = process.env.NEXT_PUBLIC_FUNNEL_API ?? "https://track.skinessence2017.com";
const KEY = process.env.NEXT_PUBLIC_FUNNEL_KEY ?? "wk_52e3aff27656e23165691b6a";

export function FunnelTracking() {
  if (!KEY) return null;
  return <Script src={`${API}/track.js`} data-api={API} data-key={KEY} data-capture-forms="" strategy="afterInteractive" />;
}
