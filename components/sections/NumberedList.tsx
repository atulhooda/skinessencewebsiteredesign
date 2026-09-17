import { cn } from "@/lib/cn";

/** Static numbered cards (all visible), used for "How it works" steps. */
export function NumberedList({ items, className }: { items: { title: string; description: string }[]; className?: string }) {
  return (
    <ol className={cn("grid gap-3 md:grid-cols-2", className)}>
      {items.map((item, index) => (
        <li key={item.title} className="rounded-2xl border border-brand-100 bg-white p-6 md:p-7">
          <span className="text-xs font-semibold tabular-nums text-brand-700">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
