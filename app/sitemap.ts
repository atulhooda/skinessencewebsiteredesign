import type { MetadataRoute } from "next";
import { getBlogPosts, getConcerns, getDoctors, getLocations, getMachines, getTreatments } from "@/lib/content";
import { routes } from "@/lib/links";
import { absoluteUrl } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

/** Every statically generated route, built from /content. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string, priority: number, changeFrequency: Entry["changeFrequency"] = "monthly"): Entry => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    entry(routes.home, 1, "weekly"),
    entry(routes.treatments, 0.9, "weekly"),
    ...getTreatments().map((t) => entry(routes.treatment(t.slug), 0.8)),
    ...getLocations().map((l) => entry(routes.location(l.slug), l.isPrimary ? 0.9 : 0.7)),
    ...getDoctors().map((d) => entry(routes.doctorProfile(d.slug), 0.8)),
    entry(routes.concerns, 0.7),
    ...getConcerns().map((c) => entry(routes.concern(c.slug), 0.7)),
    entry(routes.technology, 0.7),
    ...getMachines().map((m) => entry(routes.machine(m.slug), 0.6)),
    entry(routes.about, 0.6),
    entry(routes.contact, 0.6),
    entry(routes.blog, 0.6, "weekly"),
    ...getBlogPosts().map((p) => ({ ...entry(routes.blogPost(p.slug), 0.5), lastModified: new Date(p.date) })),
    entry(routes.privacy, 0.2, "yearly"),
    entry(routes.terms, 0.2, "yearly"),
  ];
}
