import { prisma } from "./prisma";

export type HotjarConfig = {
  siteId: string;
  version: number;
};

export async function getHotjarConfig(): Promise<HotjarConfig | null> {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { key: "global" },
      select: {
        hotjarSiteId: true,
        hotjarVersion: true,
      },
    });

    if (
      !settings ||
      !settings.hotjarSiteId ||
      settings.hotjarSiteId.trim().length === 0 ||
      !settings.hotjarVersion ||
      settings.hotjarVersion <= 0
    ) {
      return null;
    }

    return {
      siteId: settings.hotjarSiteId.trim(),
      version: settings.hotjarVersion,
    };
  } catch {
    return null;
  }
}

