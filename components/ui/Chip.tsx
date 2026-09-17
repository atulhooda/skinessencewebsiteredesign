import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipProps = {
  href?: string;
  tone?: "light" | "dark" | "brand";
  className?: string;
  children: ReactNode;
};

const tones = {
  light: "border-line bg-white text-ink-2 hover:border-brand-400 hover:text-brand-700",
  dark: "border-white/20 bg-white/10 text-white hover:bg-white/20",
  brand: "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100",
};

/** Small pill used for sub-treatment lists, special interests and tags. */
export function Chip({ href, tone = "light", className, children }: ChipProps) {
  const classes = cn(
    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium leading-none transition-colors",
    tones[tone],
    className,
  );
  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <span className={classes}>{children}</span>
  );
}
