"use client";

import { useRef, useState } from "react";
import type { Testimonial } from "@/content/schema";
import { cn } from "@/lib/cn";
import { ArrowLeftIcon, ArrowRightIcon, QuoteIcon, StarIcon } from "@/components/ui/icons";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className={cn("size-3.5", i < rating ? "text-star" : "text-white/25")} />
      ))}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();

/** Plain-React testimonial carousel: translateX track, prev/next, dots, swipe. No library, no photos. */
export function TestimonialSlider({ items, className }: { items: Testimonial[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = items.length;
  const go = (n: number) => setIndex(((n % count) + count) % count);

  return (
    <div className={cn("relative", className)} role="region" aria-roledescription="carousel" aria-label="Patient stories">
      <div
        className="overflow-hidden"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const delta = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
        }}
      >
        <ul className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((t, i) => (
            <li key={t.patient + i} className="w-full shrink-0 px-1" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index} inert={i !== index}>
              <article className="mx-auto grid max-w-4xl gap-3 rounded-3xl bg-white/5 p-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-700 px-6 py-10 text-center">
                  <span aria-hidden="true" className="grid size-20 place-items-center rounded-full bg-white/15 text-2xl font-semibold">
                    {initials(t.patient)}
                  </span>
                  <p className="mt-4 text-lg font-semibold">{t.patient}</p>
                  <p className="text-sm text-white/80">{t.treatment}</p>
                  <div className="mt-3">
                    <Stars rating={t.rating} />
                  </div>
                </div>
                <div className="flex flex-col justify-center rounded-2xl bg-brand-900/80 p-6 md:p-8">
                  <QuoteIcon className="size-7 text-brand-300" />
                  <blockquote className="mt-4 text-base leading-relaxed md:text-lg">{t.quote}</blockquote>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous story" className="grid size-10 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/10">
          <ArrowLeftIcon className="size-4" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose story">
          {items.map((_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`Story ${i + 1}`} onClick={() => go(i)} className="flex size-6 items-center justify-center">
              <span className={cn("block h-1.5 rounded-full transition-all", i === index ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next story" className="grid size-10 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/10">
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
