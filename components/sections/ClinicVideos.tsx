import type { VideosFile } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

/**
 * Short clips filmed in the clinic, shown under the patient stories.
 *
 * `preload="none"` with a poster means nothing but the still image is fetched
 * until the visitor presses play, so three videos cost the page almost nothing.
 * Native controls, no autoplay, no third-party player and no client JavaScript.
 */
export function ClinicVideos({ id = "clinic-videos", videos }: { id?: string; videos: VideosFile }) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone="muted">
      <Container>
        <Eyebrow>{videos.eyebrow}</Eyebrow>
        <h2 id={`${id}-heading`} className="mt-4 text-2xl font-medium leading-[1.12] sm:text-3xl md:text-4xl">
          {videos.title}
        </h2>
        {videos.description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{videos.description}</p>
        )}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.items.map((item) => (
            <li
              key={item.src}
              className="overflow-hidden rounded-3xl border border-brand-100 bg-white transition-shadow hover:shadow-soft"
            >
              <div className="relative aspect-[4/3] bg-surface-3">
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={item.poster.src}
                  aria-label={item.label}
                  className="absolute inset-0 h-full w-full bg-ink object-cover"
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser cannot play this video.
                </video>
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="shrink-0 text-xs tabular-nums text-muted">{item.duration}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
