"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useId, useState, type FormEvent } from "react";
import { CALLBACK_TIMES, ENQUIRY_CONSENT_TEXT, normaliseIndianMobile } from "@/lib/enquiry-shared";
import { LEAD_LIMITS } from "@/lib/lead-shared";
import { Button } from "@/components/ui/Button";

type Status = { state: "idle" } | { state: "submitting" } | { state: "success" } | { state: "error" };

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/80 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const label = "block text-xs font-medium text-ink-2";

/**
 * Enquiry form for /lp/treatments, rendered inline only (docs/BEHAVIOR_SPEC.md).
 *
 * Name, phone and a callback time; no free text, no email. POSTs JSON to
 * /api/enquiry, which records the lead in Funnel Agent. `data-fa-no-capture`
 * stops the Funnel Agent tag reading the form on submit, so the lead reaches
 * Funnel Agent once, validated, from the server. GA4 generate_lead fires only
 * after the server has accepted the lead, with no parameters beyond the form
 * location: never the name, phone, callback time or any id.
 */
export function EnquiryForm({ telHref, whatsappHref }: { telHref: string; whatsappHref: string }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name || data.name.trim().length < LEAD_LIMITS.nameMin) nextErrors.name = "Please enter your name.";
    if (!data.phone || !normaliseIndianMobile(data.phone)) nextErrors.phone = "Enter a 10-digit Indian mobile number.";
    if (!data.callbackTime) nextErrors.callbackTime = "Choose a time for the call back.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, phone: data.phone, callbackTime: data.callbackTime, website: data.website ?? "" }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !json?.ok) throw new Error(`Enquiry not accepted (${res.status})`);
      setStatus({ state: "success" });
      form.reset();
      sendGAEvent("event", "generate_lead", { form_location: "lp_treatments" });
    } catch {
      setStatus({ state: "error" });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-base font-semibold text-brand-800">Thank you. The clinic will call you back during working hours.</p>
      </div>
    );
  }

  return (
    <form id="lp-enquiry" onSubmit={onSubmit} noValidate data-fa-no-capture="" className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-name`} className={label}>
          Name
        </label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" required maxLength={LEAD_LIMITS.nameMax} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${uid}-name-error` : undefined} className={field} />
        {errors.name && (
          <p id={`${uid}-name-error`} className="mt-1 text-xs text-urgent">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className={label}>
          Mobile number
        </label>
        <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="98765 43210" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${uid}-phone-error` : undefined} className={field} />
        {errors.phone && (
          <p id={`${uid}-phone-error`} className="mt-1 text-xs text-urgent">
            {errors.phone}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-callback`} className={label}>
          Preferred callback time
        </label>
        <select id={`${uid}-callback`} name="callbackTime" required defaultValue="" aria-invalid={Boolean(errors.callbackTime)} aria-describedby={errors.callbackTime ? `${uid}-callback-error` : undefined} className={field}>
          <option value="" disabled>
            Choose a time
          </option>
          {CALLBACK_TIMES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.callbackTime && (
          <p id={`${uid}-callback-error`} className="mt-1 text-xs text-urgent">
            {errors.callbackTime}
          </p>
        )}
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <p className="text-xs leading-relaxed text-muted">{ENQUIRY_CONSENT_TEXT}</p>
        <Button type="submit" variant="primary" icon="arrow-right" size="lg" disabled={status.state === "submitting"} className="mt-3">
          {status.state === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
      {status.state === "error" && (
        <p role="alert" className="text-sm text-urgent sm:col-span-2">
          Your enquiry could not be sent. Please{" "}
          <a href={telHref} className="font-medium underline underline-offset-2">
            call the clinic
          </a>{" "}
          or{" "}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
            message us on WhatsApp
          </a>
          .
        </p>
      )}
    </form>
  );
}
