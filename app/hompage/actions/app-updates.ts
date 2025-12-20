"use server";

import { prisma } from "@/helpers/prisma";

export async function getAppUpdatesCount(): Promise<number> {
  const count = await prisma.newsPost.count({
    where: {
      published: true,
      newsType: "APP",
    },
  });
  return count;
}
