import Link from "next/link";
import type { Crumb } from "@/lib/schema-org";
import { cn } from "@/lib/cn";

/** Visual breadcrumb trail. Pair with breadcrumbJsonLd() for the structured data. */
export function Breadcrumbs({ items, tone = "light", className }: { items: Crumb[]; tone?: "light" | "default"; className?: string }) {
  const muted = tone === "light" ? "text-white/80" : "text-muted";
  const strong = tone === "light" ? "text-white" : "text-ink";
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={cn("font-medium", strong)}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className={cn("transition-colors hover:underline", muted)}>
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className={muted}>
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
