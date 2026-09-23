"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Popup } from "@/content/schema";
import type { LeadSelectOption } from "@/lib/lead-shared";
import { LeadForm } from "@/components/sections/LeadForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CloseIcon } from "@/components/ui/icons";

type Props = {
  popup: Popup;
  options: LeadSelectOption[];
  locations: LeadSelectOption[];
  defaultLocation?: string;
  whatsappHref: string;
  privacyHref: string;
};

const STORAGE_KEY = "se-lead-popup";
const TITLE_ID = "lead-popup-title";
const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";

/** Someone who closed or sent it is left alone for `repeatAfterDays`. 0 = ask every visit. */
function askedRecently(days: number): boolean {
  if (days <= 0) return false;
  try {
    const last = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(last) && last > 0 && Date.now() - last < days * 86_400_000;
  } catch {
    // Private browsing: better to ask than to never appear at all.
    return false;
  }
}

function remember(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Nothing to do: the popup simply shows again next visit.
  }
}

/**
 * Entry popup asking for the visitor's details.
 *
 * It reuses the site's own lead form, so one set of validation rules, one
 * endpoint and the WhatsApp consent box serve every form on the site. Timing,
 * how often it returns and which routes it leaves alone all come from
 * content/pages/popup.json.
 */
export function LeadPopup({ popup, options, locations, defaultLocation, whatsappHref, privacyHref }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const excluded = popup.excludePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const close = useCallback(() => {
    setOpen(false);
    remember();
  }, []);

  useEffect(() => {
    if (!popup.enabled || excluded || askedRecently(popup.repeatAfterDays)) return;
    const timer = window.setTimeout(() => setOpen(true), popup.delaySeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [popup.enabled, popup.delaySeconds, popup.repeatAfterDays, excluded]);

  // While it is open it behaves like a dialog: focus stays inside, Escape closes
  // it, the page behind does not scroll, and focus returns where it was.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;
    panel?.focus();
    document.body.classList.add("overflow-hidden");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("overflow-hidden");
      previous?.focus();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm">
      {/* min-h-full on the flex row, not the scroller: aligning a taller-than-screen
          panel with items-end otherwise pushes its top out of reach. */}
      <div
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="flex min-h-full items-end justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:items-center sm:p-6"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          tabIndex={-1}
          className="rise-in relative w-full max-w-md rounded-3xl bg-surface p-6 shadow-float outline-none sm:p-8"
        >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <CloseIcon className="size-4" />
        </button>

        <Eyebrow>{popup.eyebrow}</Eyebrow>
        <h2 id={TITLE_ID} className="mt-3 pr-10 text-2xl font-medium leading-[1.15]">
          {popup.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{popup.description}</p>

        <div className="mt-6">
          <LeadForm
            layout="modal"
            options={options}
            locations={locations}
            defaultLocation={defaultLocation}
            whatsappHref={whatsappHref}
            onSuccess={remember}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-muted">
          <button type="button" onClick={close} className="font-medium underline underline-offset-4 hover:text-ink">
            {popup.dismissLabel}
          </button>
          {popup.footnote && (
            <p className="max-w-[17rem]">
              {popup.footnote}{" "}
              <Link href={privacyHref} className="underline underline-offset-2 hover:text-ink">
                Privacy policy
              </Link>
              .
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
