"use client";

import { useId, useState, type FormEvent } from "react";
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
  /**
   * "wide": three columns. "compact": name, phone, concern, clinic and the button
   * in one row, nothing else. "modal": the same short field set stacked in one
   * column, for the popup, where the panel is far narrower than the viewport.
   */
  layout?: "default" | "wide" | "compact" | "modal";
  /** Called once the lead has been accepted, e.g. so the popup can remember it was sent. */
  onSuccess?: () => void;
};

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/80 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const label = "block text-xs font-medium text-ink-2";

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Patient details form. Full: name, phone, email (optional), treatment/concern,
 * clinic, preferred date (optional), message (≤180). Compact: the first four
 * fields and the button only. Posts JSON to /api/lead.
 */
export function LeadForm({ options, locations, defaultOption, defaultLocation, whatsappHref, layout = "default", onSuccess }: Props) {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [messageLength, setMessageLength] = useState(0);
  const wide = layout === "wide";
  const compact = layout === "compact";
  const modal = layout === "modal";
  /** Short field set: name, phone, concern and clinic only. */
  const brief = compact || modal;
  const full = modal ? "" : compact ? "sm:col-span-2 lg:col-span-5" : wide ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name || data.name.trim().length < LEAD_LIMITS.nameMin) nextErrors.name = "Please enter your full name.";
    if (!data.phone || !LEAD_LIMITS.phonePattern.test(data.phone.trim())) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (data.email && !LEAD_LIMITS.emailPattern.test(data.email.trim())) nextErrors.email = "Enter a valid email address, or leave it blank.";
    if (!data.concern) nextErrors.concern = "Choose the treatment or concern closest to yours.";
    if (!data.location) nextErrors.location = "Choose a clinic.";
    if (data.preferredDate && data.preferredDate < todayIso()) nextErrors.preferredDate = "Choose today or a later date.";
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
      onSuccess?.();
    } catch {
      setStatus({ state: "error", message: "Something went wrong sending your request." });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-lg font-semibold text-brand-800">Thank you, we have your details.</p>
        <p className="mt-2 text-sm text-ink-2">You will receive a confirmation call or WhatsApp message during clinic hours to fix your slot.</p>
        <Button onClick={() => setStatus({ state: "idle" })} variant="light" icon="none" size="sm" className="mt-5">
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "grid gap-4",
        !modal && "sm:grid-cols-2",
        wide && "gap-5 lg:grid-cols-3",
        compact && "lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-start",
      )}
    >
      <div>
        <label htmlFor={`${uid}-name`} className={label}>
          Full Name
        </label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" required maxLength={LEAD_LIMITS.nameMax} placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${uid}-name-error` : undefined} className={field} />
        {errors.name && (
          <p id={`${uid}-name-error`} className="mt-1 text-xs text-urgent">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className={label}>
          Phone Number
        </label>
        <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${uid}-phone-error` : undefined} className={field} />
        {errors.phone && (
          <p id={`${uid}-phone-error`} className="mt-1 text-xs text-urgent">
            {errors.phone}
          </p>
        )}
        {/* Opt-in for WhatsApp updates. Named whatsapp_consent because the analytics script matches that name. */}
        <label htmlFor={`${uid}-whatsapp-consent`} className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <input
            id={`${uid}-whatsapp-consent`}
            name="whatsapp_consent"
            type="checkbox"
            className="mt-px size-4 shrink-0 rounded border-line accent-brand-600"
          />
          <span>Send me updates and offers on WhatsApp</span>
        </label>
      </div>
      {!brief && (
      <div>
        <label htmlFor={`${uid}-email`} className={label}>
          Email <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" maxLength={120} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} className={field} />
        {errors.email && <p className="mt-1 text-xs text-urgent">{errors.email}</p>}
      </div>
      )}
      <div>
        <label htmlFor={`${uid}-concern`} className={label}>
          Treatment / Concern
        </label>
        <select id={`${uid}-concern`} name="concern" required defaultValue={defaultOption ?? ""} aria-invalid={Boolean(errors.concern)} className={field}>
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
        <label htmlFor={`${uid}-location`} className={label}>
          Preferred Clinic
        </label>
        <select id={`${uid}-location`} name="location" required defaultValue={defaultLocation ?? locations[0]?.value ?? ""} className={field}>
          {locations.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        {errors.location && <p className="mt-1 text-xs text-urgent">{errors.location}</p>}
      </div>
      {!brief && (
      <div>
        <label htmlFor={`${uid}-date`} className={label}>
          Preferred Date <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id={`${uid}-date`} name="preferredDate" type="date" min={todayIso()} aria-invalid={Boolean(errors.preferredDate)} className={field} />
        {errors.preferredDate && <p className="mt-1 text-xs text-urgent">{errors.preferredDate}</p>}
      </div>
      )}
      {!brief && (
      <div className={full}>
        <label htmlFor={`${uid}-message`} className={label}>
          Message <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id={`${uid}-message`} name="message" rows={wide ? 3 : 5} maxLength={LEAD_LIMITS.messageMax} onChange={(e) => setMessageLength(e.target.value.length)} placeholder="Tell us about your concern, how long you have had it, and preferred days or times." className={cn(field, "resize-y")} />
        <p className="mt-1 text-right text-[11px] text-muted" aria-live="polite">
          {messageLength}/{LEAD_LIMITS.messageMax}
        </p>
        {errors.message && <p className="mt-1 text-xs text-urgent">{errors.message}</p>}
      </div>
      )}
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={cn("flex", modal ? "mt-1" : compact ? "sm:col-span-2 lg:col-span-1 lg:pt-[1.625rem]" : cn("justify-end", full))}>
        <Button type="submit" variant="primary" icon="arrow-right" size="lg" disabled={status.state === "submitting"} className={cn(brief && "w-full justify-between", compact && "lg:w-auto")}>
          {status.state === "submitting" ? "Sending…" : "Book Consultation"}
        </Button>
      </div>
      {status.state === "error" && (
        <p role="alert" className={cn("text-sm text-urgent", full)}>
          {status.message}{" "}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
            Message us on WhatsApp instead.
          </a>
        </p>
      )}
    </form>
  );
}
