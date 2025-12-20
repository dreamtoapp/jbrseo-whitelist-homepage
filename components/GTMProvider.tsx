import { getGtmId } from "@/helpers/gtm";
import { GTMClient } from "./GTMClient";

export async function GTMProvider() {
  const gtmId = await getGtmId();

  if (!gtmId) {
    return null;
  }

  return <GTMClient gtmId={gtmId} />;
}
