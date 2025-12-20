import type { MetadataRoute } from "next";

import { prisma } from "@/helpers/prisma";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

