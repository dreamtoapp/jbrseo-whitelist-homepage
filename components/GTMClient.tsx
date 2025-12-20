"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { GTMRouteTracker } from "./GTMRouteTracker";

type GTMClientProps = {
  gtmId: string;
};

export function GTMClient({ gtmId }: GTMClientProps) {
  return (
    <>
      <GoogleTagManager gtmId={gtmId} />
      <GTMRouteTracker gtmId={gtmId} />
    </>
  );
}
