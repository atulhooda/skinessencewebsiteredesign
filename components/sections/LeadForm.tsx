"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { LEAD_LIMITS, type LeadSelectOption } from "@/lib/lead-shared";
import { Button } from "@/components/ui/Button";

type Status = { state: "idle" } | { state: "submitting" } | { state: "success" } | { state: "error"; message: string };

type Props = {
  /** Treatment / concern options: the client's canonical list from content/lead-options.json. */
  options: LeadSelectOption[];
  locations: LeadSelectOption[];
  defaultOption?: string;
  defaultLocation?: string;
  whatsappHref: string;
};

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/80 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const label = "block text-xs font-medium text-ink-2";

/** Lead form: Full Name, Phone, Treatment/Concern, Location, Message (≤180). Posts JSON to /api/lead. */
export function LeadForm({ options, locations, defaultOption, defaultLocation, whatsappHref }: Props) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [messageLength, setMessageLength] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name || data.name.trim().length < LEAD_LIMITS.nameMin) nextErrors.name = "Please enter your full name.";
    if (!data.phone || !LEAD_LIMITS.phonePattern.test(data.phone.trim())) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!data.concern) nextErrors.concern = "Choose the treatment or concern closest to yours.";
    if (!data.location) nextErrors.location = "Choose a clinic.";
    if (data.message && data.message.length > LEAD_LIMITS.messageMax) nextErrors.message = `Keep the message under ${LEAD_LIMITS.messageMax} characters.`;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus({ state: "success" });
      form.reset();
      setMessageLength(0);
    } catch {
      setStatus({ state: "error", message: "Something went wrong sending your request." });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-lg font-semibold text-brand-800">Thank you, we have your request.</p>
        <p className="mt-2 text-sm text-ink-2">You will receive a confirmation call or WhatsApp message during clinic hours to fix your slot.</p>
        <Button onClick={() => setStatus({ state: "idle" })} variant="light" icon="none" size="sm" className="mt-5">
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="lead-name" className={label}>
          Full Name
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={LEAD_LIMITS.nameMax}
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          className={field}
        />
        {errors.name && (
          <p id="lead-name-error" className="mt-1 text-xs text-urgent">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="lead-phone" className={label}>
          Phone Number
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="+91 98765 43210"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
          className={field}
        />
        {errors.phone && (
          <p id="lead-phone-error" className="mt-1 text-xs text-urgent">
            {errors.phone}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="lead-concern" className={label}>
          Treatment / Concern
        </label>
        <select id="lead-concern" name="concern" required defaultValue={defaultOption ?? ""} aria-invalid={Boolean(errors.concern)} className={field}>
          <option value="" disabled>
            Please select an option
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.concern && <p className="mt-1 text-xs text-urgent">{errors.concern}</p>}
      </div>
      <div>
        <label htmlFor="lead-location" className={label}>
          Location
        </label>
        <select id="lead-location" name="location" required defaultValue={defaultLocation ?? locations[0]?.value ?? ""} className={field}>
          {locations.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        {errors.location && <p className="mt-1 text-xs text-urgent">{errors.location}</p>}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="lead-message" className={label}>
          Message <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={5}
          maxLength={LEAD_LIMITS.messageMax}
          onChange={(e) => setMessageLength(e.target.value.length)}
          placeholder="Tell us what you're looking for, and preferred days or times."
          className={cn(field, "resize-y")}
        />
        <p className="mt-1 text-right text-[11px] text-muted" aria-live="polite">
          {messageLength}/{LEAD_LIMITS.messageMax}
        </p>
        {errors.message && <p className="mt-1 text-xs text-urgent">{errors.message}</p>}
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          You will receive a friendly confirmation call or WhatsApp message during clinic hours. No spam, ever.
        </p>
        <Button type="submit" variant="primary" icon="arrow-right" disabled={status.state === "submitting"}>
          {status.state === "submitting" ? "Sending…" : "Book Consultation"}
        </Button>
      </div>
      {status.state === "error" && (
        <p role="alert" className="text-sm text-urgent sm:col-span-2">
          {status.message}{" "}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
            Message us on WhatsApp instead.
          </a>
        </p>
      )}
    </form>
  );
}
