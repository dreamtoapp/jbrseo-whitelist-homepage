"use client";

import { useEffect } from "react";
import Hotjar from "@hotjar/browser";
import { HotjarRouteTracker } from "./HotjarRouteTracker";

type HotjarClientProps = {
  siteId: string;
  version: number;
};

export function HotjarClient({ siteId, version }: HotjarClientProps) {
  useEffect(() => {
    try {
      Hotjar.init(parseInt(siteId, 10), version);
    } catch {
      // Silently fail if initialization fails
    }
  }, [siteId, version]);

  return <HotjarRouteTracker siteId={siteId} />;
}

