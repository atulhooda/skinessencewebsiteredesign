import { cn } from "@/lib/cn";
import { ArrowUpRightIcon } from "./icons";

/** The small circular arrow that sits on image cards in the reference design. */
export function ArrowBadge({ tone = "light", className }: { tone?: "light" | "dark" | "brand"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 place-items-center rounded-full border transition-colors",
        tone === "light" && "border-white/60 bg-white/20 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-ink",
        tone === "dark" && "border-line bg-white text-ink group-hover:bg-ink group-hover:text-white",
        tone === "brand" && "border-brand-600 bg-brand-600 text-white group-hover:bg-white group-hover:text-brand-700",
        className,
      )}
    >
      <ArrowUpRightIcon className="size-4" />
    </span>
  );
}
