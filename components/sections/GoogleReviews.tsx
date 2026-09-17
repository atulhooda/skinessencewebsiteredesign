/**
 * Google Reviews slot (brief 9.11). The client has not supplied a Place ID yet.
 * Set NEXT_PUBLIC_GOOGLE_PLACE_ID to show the "Read our Google reviews" link and
 * expose a mount point for a reviews widget. Renders nothing otherwise.
 */
export function GoogleReviews({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  if (!placeId) {
    return process.env.NODE_ENV === "development" ? (
      <p className={tone === "dark" ? "mt-8 text-center text-xs text-white/70" : "mt-8 text-center text-xs text-muted"}>
        Google Reviews slot: set NEXT_PUBLIC_GOOGLE_PLACE_ID to enable (dev-only note).
      </p>
    ) : null;
  }
  return (
    <div className="mt-8 text-center">
      <a
        href={`https://search.google.com/local/reviews?placeid=${encodeURIComponent(placeId)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={tone === "dark" ? "text-sm font-medium text-white underline underline-offset-4" : "text-sm font-medium text-brand-700 underline underline-offset-4"}
      >
        Read our reviews on Google
      </a>
      {/* Mount point for a reviews widget (e.g. Elfsight/Trustindex) once the client picks one. */}
      <div id="google-reviews-widget" data-place-id={placeId} className="mt-4" />
    </div>
  );
}
