import { NextResponse } from "next/server";
import { z } from "zod";
import { LeadSchema } from "@/lib/lead";

/**
 * POST /api/lead — validates a booking request and, for now, logs it.
 *
 * Stub for the clinic's own backend: replace the `console.info` below with a
 * call to your CRM / API. Keep the validation. This is the only non-static
 * route in the project; on Vercel it becomes a serverless function.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body must be JSON." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { website, ...lead } = parsed.data;
  // Honeypot filled: respond as if accepted, do not record.
  if (website) return NextResponse.json({ ok: true });

  const record = {
    ...lead,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? null,
    referer: request.headers.get("referer") ?? null,
  };

  // TODO(backend): forward `record` to the clinic's backend. Until then it is only logged.
  console.info("[lead]", JSON.stringify(record));

  return NextResponse.json({ ok: true });
}
