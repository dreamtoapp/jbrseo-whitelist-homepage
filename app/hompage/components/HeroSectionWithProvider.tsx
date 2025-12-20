"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { WhitelistFormProvider } from "./WhitelistFormTrigger";
import { HeroSection } from "./HeroSection";
import type { HomePageContent } from "./HomePage";

const WhitelistFormDialog = dynamic(
  () => import("./WhitelistFormDialog").then((mod) => ({ default: mod.WhitelistFormDialog })),
  { ssr: false }
);

type HeroSectionWithProviderProps = {
  content: HomePageContent;
};

export function HeroSectionWithProvider({ content }: HeroSectionWithProviderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <WhitelistFormProvider open={dialogOpen} setOpen={setDialogOpen}>
      <HeroSection content={content} />
      <WhitelistFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        content={content}
      />
    </WhitelistFormProvider>
  );
}






