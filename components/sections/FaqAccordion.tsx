"use client";

import { useId, useState } from "react";
import type { FaqGroup } from "@/content/schema";
import { cn } from "@/lib/cn";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

/**
 * Tabbed FAQ accordion. Every question/answer stays in the DOM (hidden when
 * collapsed) so the markup matches the FAQPage JSON-LD rendered alongside it.
 */
export function FaqAccordion({ groups, className }: { groups: FaqGroup[]; className?: string }) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<string | null>(`0-0`);
  const baseId = useId();
  const showTabs = groups.length > 1;

  return (
    <div className={className}>
      {showTabs && (
        <div role="tablist" aria-label="Question categories" className="flex flex-wrap justify-center gap-2">
          {groups.map((group, g) => (
            <button
              key={group.category}
              type="button"
              role="tab"
              id={`${baseId}-tab-${g}`}
              aria-selected={tab === g}
              aria-controls={`${baseId}-panel-${g}`}
              onClick={() => setTab(g)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-colors",
                tab === g ? "bg-ink text-white" : "bg-surface-2 text-ink-2 hover:bg-surface-3",
              )}
            >
              {group.category}
            </button>
          ))}
        </div>
      )}

      {groups.map((group, g) => (
        <div
          key={group.category}
          role={showTabs ? "tabpanel" : undefined}
          id={`${baseId}-panel-${g}`}
          aria-labelledby={showTabs ? `${baseId}-tab-${g}` : undefined}
          hidden={showTabs && tab !== g}
          className={cn("flex flex-col gap-3", showTabs && "mt-8")}
        >
          {group.items.map((item, i) => {
            const key = `${g}-${i}`;
            const isOpen = open === key;
            const buttonId = `${baseId}-q-${key}`;
            const panelId = `${baseId}-a-${key}`;
            return (
              <div key={item.q} className={cn("rounded-2xl border transition-colors", isOpen ? "border-brand-300 bg-brand-50" : "border-brand-100 bg-white hover:border-brand-400")}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium md:text-base"
                  >
                    <span>{item.q}</span>
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border transition-colors",
                        isOpen ? "border-brand-600 bg-brand-600 text-white" : "border-brand-200 bg-brand-50 text-brand-800",
                      )}
                    >
                      {isOpen ? <MinusIcon className="size-4" /> : <PlusIcon className="size-4" />}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-5 pb-5">
                  <p className="max-w-2xl text-sm leading-relaxed text-ink-2">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
