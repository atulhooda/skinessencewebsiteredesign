import type { Stat } from "@/content/schema";
import { cn } from "@/lib/cn";
import { StatIcon } from "./icons";

type Tone = "light" | "dark";

export function StatCard({ stat, tone = "light", showIcon = false }: { stat: Stat; tone?: Tone; showIcon?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl p-5 md:p-6",
        tone === "dark" ? "border border-white/10 bg-white/10 text-white" : "border border-brand-100 bg-white text-ink",
      )}
    >
      {showIcon && (
        <span
          className={cn(
            "mb-8 grid size-9 place-items-center rounded-full",
            tone === "dark" ? "bg-white/10 text-white" : "bg-brand-50 text-brand-700",
          )}
        >
          <StatIcon name={stat.icon} className="size-4" />
        </span>
      )}
      <p className={cn("text-2xl font-semibold tracking-tight md:text-3xl", tone === "light" && "text-brand-800")}>{stat.value}</p>
      <p className={cn("mt-1 text-sm font-medium", tone === "dark" ? "text-white/90" : "text-ink-2")}>{stat.label}</p>
      {stat.description && (
        <p className={cn("mt-1.5 text-xs leading-relaxed", tone === "dark" ? "text-white/80" : "text-muted")}>{stat.description}</p>
      )}
    </div>
  );
}

export function StatsRow({
  stats,
  tone = "light",
  showIcons = false,
  className,
}: {
  stats: Stat[];
  tone?: Tone;
  showIcons?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {stats.map((stat) => (
        <li key={stat.label}>
          <StatCard stat={stat} tone={tone} showIcon={showIcons} />
        </li>
      ))}
    </ul>
  );
}
