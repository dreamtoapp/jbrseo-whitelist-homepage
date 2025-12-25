"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Hotjar from "@hotjar/browser";

type HotjarRouteTrackerProps = {
  siteId: string;
};

export function HotjarRouteTracker({ siteId }: HotjarRouteTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    requestAnimationFrame(() => {
      try {
        Hotjar.stateChange(pathname);
      } catch {
        // Silently fail if Hotjar is not initialized
      }
    });
  }, [pathname, siteId]);

  return null;
}

