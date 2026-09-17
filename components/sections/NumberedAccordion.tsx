"use client";

import { useId, useState } from "react";
import type { Principle } from "@/content/schema";
import { cn } from "@/lib/cn";
import { PlusIcon } from "@/components/ui/icons";

/**
 * Numbered accordion with obvious affordances: numbered badge, a plus button
 * that rotates into a minus, a tinted open state and a smooth slide animation.
 * Every description stays in the DOM (collapsed), so the copy is crawlable.
 */
export function NumberedAccordion({ items, defaultOpen = 0, className }: { items: Principle[]; defaultOpen?: number; className?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div
            key={item.title}
            className={cn(
              "rounded-2xl border transition-all duration-300",
              isOpen ? "border-brand-300 bg-brand-50 shadow-soft" : "border-brand-100 bg-white hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft",
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left md:px-5 md:py-5"
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums transition-colors duration-300",
                    isOpen ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-800",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-semibold md:text-lg">{item.title}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen ? "rotate-45 border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-ink",
                  )}
                >
                  <PlusIcon className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-5 md:pl-[4.75rem] md:pr-6">
                  <p className="max-w-lg text-sm leading-relaxed text-ink-2">{item.description}</p>
                  <div aria-hidden="true" className="mt-4 h-0.5 w-full rounded-full bg-brand-100">
                    <div className="h-full w-2/3 rounded-full bg-brand-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
