"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type GTMRouteTrackerProps = {
  gtmId: string;
};

export function GTMRouteTracker({ gtmId }: GTMRouteTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !window.dataLayer) {
      return;
    }

    // Defer document.title access to avoid forced reflow
    requestAnimationFrame(() => {
      window.dataLayer?.push({
        event: "page_view",
        page_path: pathname,
        page_title: document.title,
      });
    });
  }, [pathname]);

  return null;
}
