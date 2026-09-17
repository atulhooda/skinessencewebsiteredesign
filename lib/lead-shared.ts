/** Constants shared by the lead form (client) and the /api/lead validator (server). */
export type LeadSelectOption = { value: string; label: string };

export const LEAD_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  /** Indian mobile: optional +91 / 0, then a 10-digit number starting 6-9. Spaces and dashes allowed. */
  phonePattern: /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/,
  /** The existing site's form caps the message at 180 characters (brief 3.7). */
  messageMax: 180,
} as const;
