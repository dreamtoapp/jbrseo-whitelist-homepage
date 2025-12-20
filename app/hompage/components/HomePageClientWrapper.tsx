"use client";

import { useState } from "react";
import { WhitelistFormDialog } from "./WhitelistFormDialog";
import { WhitelistFormProvider } from "./WhitelistFormTrigger";
import type { HomePageContent } from "./HomePage";

type HomePageClientWrapperProps = {
  content: HomePageContent;
  children: React.ReactNode;
};

export function HomePageClientWrapper({ content, children }: HomePageClientWrapperProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <WhitelistFormProvider open={dialogOpen} setOpen={setDialogOpen}>
      {children}
      <WhitelistFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        content={content}
      />
    </WhitelistFormProvider>
  );
}






