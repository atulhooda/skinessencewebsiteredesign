const STEPS = [
  { title: "We call you back", text: "A confirmation call or WhatsApp message during clinic hours." },
  { title: "Your slot is fixed", text: "A time that suits you, with directions to the clinic." },
  { title: "Consultation", text: "Examination, honest options and a written plan." },
];

/** Three-step "what happens next" strip shown under the booking form. */
export function NextSteps({ className = "" }: { className?: string }) {
  return (
    <ol className={`grid gap-3 border-t border-brand-100 pt-6 sm:grid-cols-3 ${className}`} aria-label="What happens next">
      {STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800">{index + 1}</span>
          <span>
            <span className="block text-sm font-semibold text-ink">{step.title}</span>
            <span className="block text-xs leading-relaxed text-muted">{step.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
