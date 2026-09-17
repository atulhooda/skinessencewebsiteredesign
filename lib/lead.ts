import { z } from "zod";
import { LEAD_LIMITS } from "./lead-shared";

/** Server-side validation for POST /api/lead. Mirrors the client checks in LeadForm. */
export const LeadSchema = z.object({
  name: z.string().trim().min(LEAD_LIMITS.nameMin).max(LEAD_LIMITS.nameMax),
  phone: z.string().trim().regex(LEAD_LIMITS.phonePattern, "Enter a valid Indian mobile number"),
  email: z.union([z.literal(""), z.string().trim().max(120).regex(LEAD_LIMITS.emailPattern, "Enter a valid email address")]).optional().default(""),
  /** ISO date (YYYY-MM-DD) or empty. */
  preferredDate: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().default(""),
  concern: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(80),
  message: z.string().trim().max(LEAD_LIMITS.messageMax).optional().default(""),
  /** Path the form was submitted from, for attribution. */
  page: z.string().max(200).optional(),
  /** Honeypot. Humans never fill it. */
  website: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;
