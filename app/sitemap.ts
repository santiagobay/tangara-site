import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { templates } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...templates.map((x) => ({
      url: `${site.url}/templates/${x.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
