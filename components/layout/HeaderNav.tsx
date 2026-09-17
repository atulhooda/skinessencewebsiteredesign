"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, PlusIcon } from "@/components/ui/icons";
import type { NavData } from "./nav-data";

/**
 * Floating header over the hero card: logo + wordmark, centred "+" menu
 * toggle, desktop links and the Book pill. The "+" opens a full-screen menu
 * that lists every treatment, concern, page and location.
 */
export function HeaderNav({ nav }: { nav: NavData }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  // Close on route change and on Escape; lock scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const brandMark = (
    <span className="flex items-center gap-3">
      <Image
        src={(nav.logoMono ?? nav.logo).src}
        alt=""
        width={(nav.logoMono ?? nav.logo).width}
        height={(nav.logoMono ?? nav.logo).height}
        priority
        className="h-11 w-auto md:h-12"
        sizes="64px"
      />
      <span className="text-lg font-semibold tracking-tight md:text-xl">{nav.brand}</span>
    </span>
  );

  return (
    <header className="absolute inset-x-3 top-3 z-40 md:inset-x-5 md:top-5">
      <div className="grid grid-cols-[1fr_auto] items-center px-4 py-3 text-white md:grid-cols-[1fr_auto_1fr] md:px-8 md:py-5">
        <Link href={routes.home} className="justify-self-start" aria-label={`${nav.brand} home`}>
          {brandMark}
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 grid size-10 place-items-center rounded-full border border-white/45 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <PlusIcon className={cn("size-5 transition-transform duration-300", open && "rotate-45")} />
        </button>

        <div className="hidden items-center justify-self-end gap-6 md:flex">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm text-white/85">
              {nav.primary.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn("transition-colors hover:text-white", pathname === link.href && "text-white underline underline-offset-4")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden sm:block">
            <Button href={routes.book} variant="outline" icon="arrow-up-right" size="sm">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Full-screen menu */}
      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-brand-950 text-white scrollbar-thin"
      >
        <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-24 md:px-10 md:pt-28">
          <p className="text-xs text-white/80">{nav.positioning}</p>
          <nav aria-label="Site menu" className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-300">Pages</h2>
              <ul className="mt-4 space-y-2 text-lg">
                <li>
                  <Link href={routes.home} className="hover:text-brand-200">
                    Home
                  </Link>
                </li>
                {nav.primary.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-brand-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-brand-300">Clinics</h2>
              <ul className="mt-4 space-y-2 text-base">
                {nav.locations.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-brand-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-300">Treatments</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {nav.categories.map((category) => (
                  <div key={category.slug}>
                    <Link href={routes.category(category.slug)} className="text-base font-medium hover:text-brand-200">
                      {category.name}
                    </Link>
                    <ul className="mt-2 space-y-1.5 text-sm text-white/75">
                      {category.treatments.map((t) => (
                        <li key={t.href}>
                          <Link href={t.href} className="hover:text-white">
                            {t.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-300">Concerns</h2>
              <ul className="mt-4 space-y-1.5 text-sm text-white/75">
                {nav.concerns.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-brand-300">Contact</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href={nav.phoneHref} className="hover:text-brand-200">
                    {nav.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={nav.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-brand-200">
                    WhatsApp <ArrowUpRightIcon className="size-3.5" />
                  </a>
                </li>
                <li>
                  <a href={`mailto:${nav.email}`} className="hover:text-brand-200">
                    {nav.email}
                  </a>
                </li>
              </ul>
              <Button href={routes.book} variant="primary" icon="arrow-right" className="mt-8" onClick={() => setOpen(false)}>
                Book Consultation
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
