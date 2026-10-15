"use client";

import { useEffect } from "react";
import { GCLID_COOKIE, GCLID_MAX_AGE_DAYS, GCLID_PATTERN } from "@/lib/enquiry-shared";

/**
 * Keeps the Google Ads click id from the landing URL (?gclid=…) in a
 * first-party cookie for 90 days, so an enquiry sent later, or after the
 * visitor has moved around, can still be matched to the ad click in an
 * offline conversion upload. /api/enquiry reads the cookie; the gclid is
 * never put in a form field or a request URL by this site.
 */
export function GclidCapture() {
  useEffect(() => {
    const gclid = new URLSearchParams(window.location.search).get("gclid");
    if (!gclid || !GCLID_PATTERN.test(gclid)) return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${GCLID_COOKIE}=${encodeURIComponent(gclid)}; Max-Age=${GCLID_MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  }, []);
  return null;
}
