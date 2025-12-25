import { getHotjarConfig } from "@/helpers/hotjar";
import { HotjarClient } from "./HotjarClient";

export async function HotjarProvider() {
  const config = await getHotjarConfig();

  if (!config) {
    return null;
  }

  return <HotjarClient siteId={config.siteId} version={config.version} />;
}

