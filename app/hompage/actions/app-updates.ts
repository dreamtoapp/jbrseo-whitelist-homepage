"use server";

import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/helpers/prisma";

export async function getAppUpdatesCount(): Promise<number> {
  "use cache";
  cacheLife("hours");
  cacheTag("app-updates-count");

  const count = await prisma.newsPost.count({
    where: {
      published: true,
      newsType: "APP",
    },
  });

  return count;
}
