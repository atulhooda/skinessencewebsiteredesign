import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** "● Our Story" style label above headings. */
export function Eyebrow({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-xs font-medium",
        tone === "light" ? "text-white/90" : "text-brand-700",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", tone === "light" ? "bg-brand-300" : "bg-brand-600")}
      />
      <span>{children}</span>
    </p>
  );
}
