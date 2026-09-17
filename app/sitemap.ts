import type { MetadataRoute } from "next";
import { getMachines, getTreatments } from "@/lib/content";
import { routes } from "@/lib/links";
import { absoluteUrl } from "@/lib/seo";

/**
 * Every statically generated route. Phase 2 routes (concerns, locations,
 * about, doctor, contact, blog) get appended here as they ship.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl(routes.home), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(routes.treatments), lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...getTreatments().map((t) => ({
      url: absoluteUrl(routes.treatment(t.slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl(routes.technology), lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    ...getMachines().map((m) => ({
      url: absoluteUrl(routes.machine(m.slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
