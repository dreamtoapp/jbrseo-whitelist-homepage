"use client";

import dynamic from "next/dynamic";

const WhitelistForm = dynamic(() => import("./WhitelistForm").then((mod) => ({ default: mod.WhitelistForm })), {
  ssr: false,
});

export function WhitelistFormWrapper() {
  return <WhitelistForm />;
}



