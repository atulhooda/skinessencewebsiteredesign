import type { GoogleProfile } from "@/content/schema";
import { cn } from "@/lib/cn";
import { StarIcon } from "@/components/ui/icons";

/**
 * The clinic's Google rating and a link to the full list.
 *
 * Content, not an API: the rating, the count and the link live in
 * content/testimonials.json. That keeps the page static and free, needs no
 * Google Cloud key, and adds no third-party script. Renders nothing until the
 * clinic supplies the link, so it never shows an empty or invented rating.
 */
export function GoogleReviews({ profile, tone = "dark" }: { profile?: GoogleProfile; tone?: "dark" | "light" }) {
  if (!profile) return null;
  const rating = profile.rating.toFixed(1);
  const filled = Math.round(profile.rating);
  return (
    <div className="mt-10 flex flex-col items-center gap-3 text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm">
        <span className="inline-flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5 on Google`}>
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              className={cn("size-4", i < filled ? "text-star" : tone === "dark" ? "text-white/25" : "text-line")}
            />
          ))}
        </span>
        <span className="font-semibold">{rating}</span>
        <span className={tone === "dark" ? "text-white/75" : "text-muted"}>
          from {profile.count} Google {profile.count === 1 ? "review" : "reviews"}
        </span>
      </p>
      <a
        href={profile.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-sm font-medium underline underline-offset-4",
          tone === "dark" ? "text-white hover:text-brand-200" : "text-brand-700 hover:text-brand-800",
        )}
      >
        Read all reviews on Google
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
