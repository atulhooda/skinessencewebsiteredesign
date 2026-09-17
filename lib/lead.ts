import { z } from "zod";
import { LEAD_LIMITS } from "./lead-shared";

/** Server-side validation for POST /api/lead. Mirrors the client checks in LeadForm. */
export const LeadSchema = z.object({
  name: z.string().trim().min(LEAD_LIMITS.nameMin).max(LEAD_LIMITS.nameMax),
  phone: z.string().trim().regex(LEAD_LIMITS.phonePattern, "Enter a valid Indian mobile number"),
  concern: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(80),
  message: z.string().trim().max(LEAD_LIMITS.messageMax).optional().default(""),
  /** Path the form was submitted from, for attribution. */
  page: z.string().max(200).optional(),
  /** Honeypot. Humans never fill it. */
  website: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;
