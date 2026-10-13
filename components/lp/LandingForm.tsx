"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { LeadSelectOption } from "@/lib/lead-shared";
import { LeadForm } from "@/components/sections/LeadForm";

/**
 * The site's own booking form, unchanged: same validation, same /api/lead
 * endpoint, same WhatsApp consent box, and the Funnel Agent tag captures it
 * exactly as it does elsewhere. The only addition is a GA event when a lead
 * is accepted.
 */
export function LandingForm(props: {
  options: LeadSelectOption[];
  locations: LeadSelectOption[];
  defaultLocation?: string;
  whatsappHref: string;
}) {
  return (
    <LeadForm
      {...props}
      layout="default"
      onSuccess={() => sendGAEvent("event", "generate_lead", { form: "lp_treatments", page_path: "/lp/treatments" })}
    />
  );
}
