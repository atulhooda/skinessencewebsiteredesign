import type { DayOfWeek, Location, OpeningHours } from "@/content/schema";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 2500 → "₹2,500"; 300000 → "₹3,00,000" */
export function formatInr(amount: number): string {
  return `₹${inr.format(amount)}`;
}

/** "19:00" → "7:00 PM" */
export function to12Hour(time: string): string {
  const [h = "0", m = "00"] = time.split(":");
  const hours = Number(h);
  const suffix = hours >= 12 ? "PM" : "AM";
  const twelve = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelve}:${m} ${suffix}`;
}

const DAY_ORDER: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export type HoursRow = { days: string; time: string };

/**
 * Groups consecutive days with identical times:
 * Mon–Sat 10:00–19:00 + Sun closed → [{ days: "Monday – Saturday", time: "10:00 AM – 7:00 PM" }]
 */
export function groupHours(hours: OpeningHours[]): HoursRow[] {
  const byDay = new Map(hours.map((h) => [h.day, `${to12Hour(h.open)} – ${to12Hour(h.close)}`]));
  const rows: { start: DayOfWeek; end: DayOfWeek; time: string }[] = [];
  for (const day of DAY_ORDER) {
    const time = byDay.get(day);
    if (!time) continue;
    const last = rows[rows.length - 1];
    const prevIndex = last ? DAY_ORDER.indexOf(last.end) : -2;
    if (last && last.time === time && DAY_ORDER.indexOf(day) === prevIndex + 1) {
      last.end = day;
    } else {
      rows.push({ start: day, end: day, time });
    }
  }
  return rows.map((r) => ({ days: r.start === r.end ? r.start : `${r.start} – ${r.end}`, time: r.time }));
}

/** Days not covered by any opening-hours entry, e.g. ["Sunday"]. */
export function closedDays(hours: OpeningHours[]): DayOfWeek[] {
  const open = new Set(hours.map((h) => h.day));
  return DAY_ORDER.filter((d) => !open.has(d));
}

export function formatAddressInline(location: Location): string {
  return location.addressLines.join(", ");
}

/** True when the client has supplied a street address for this location. */
export function hasAddress(location: Location): boolean {
  return location.addressLines.length > 0;
}
