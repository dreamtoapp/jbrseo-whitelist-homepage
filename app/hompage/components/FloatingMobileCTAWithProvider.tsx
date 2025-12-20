"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { WhitelistFormProvider } from "./WhitelistFormTrigger";
import { FloatingMobileCTA } from "./FloatingMobileCTA";
import type { HomePageContent } from "./HomePage";

const WhitelistFormDialog = dynamic(
  () => import("./WhitelistFormDialog").then((mod) => ({ default: mod.WhitelistFormDialog })),
  { ssr: false }
);

type FloatingMobileCTAWithProviderProps = {
  content: HomePageContent;
};

export function FloatingMobileCTAWithProvider({ content }: FloatingMobileCTAWithProviderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <WhitelistFormProvider open={dialogOpen} setOpen={setDialogOpen}>
      <FloatingMobileCTA />
      <WhitelistFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        content={content}
      />
    </WhitelistFormProvider>
  );
}






