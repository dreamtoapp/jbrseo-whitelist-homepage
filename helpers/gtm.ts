import { prisma } from "./prisma";

export async function getGtmId(): Promise<string | null> {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { key: "global" },
      select: { gtmId: true },
    });

    if (!settings || !settings.gtmId || settings.gtmId.trim().length === 0) {
      return null;
    }

    return settings.gtmId.trim();
  } catch {
    return null;
  }
}
