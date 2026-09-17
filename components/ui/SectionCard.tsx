import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  white: "bg-surface",
  muted: "bg-surface-2",
  brand: "bg-brand-800 text-white",
  dark: "bg-brand-950 text-white",
  transparent: "",
};

const paddings = {
  default: "px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-16 lg:py-24",
  compact: "px-5 py-8 sm:px-8 md:px-12 md:py-10 lg:px-16",
};

type SectionCardProps = {
  /** Anchor id for the section (e.g. "book"). */
  id: string;
  /** id of the heading element inside this section, for aria-labelledby. */
  headingId: string;
  tone?: keyof typeof tones;
  padding?: keyof typeof paddings;
  className?: string;
  children: ReactNode;
};

/**
 * The rounded "card" that every section of the reference design sits in.
 * Always a landmark <section> labelled by its own heading.
 */
export function SectionCard({ id, headingId, tone = "white", padding = "default", className, children }: SectionCardProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("rounded-3xl md:rounded-4xl", tones[tone], paddings[padding], className)}
    >
      {children}
    </section>
  );
}
