"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { WhitelistFormDialog } from "./WhitelistFormDialog";
import { WhitelistFormProvider } from "./WhitelistFormTrigger";
import type { HomePageContent } from "./HomePage";

type HomePageClientProps = {
  content: HomePageContent;
  children: React.ReactNode;
};

function HomePageClientInner({ content, children }: HomePageClientProps) {
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

const HomePageClient = dynamic(() => Promise.resolve({ default: HomePageClientInner }), {
  ssr: false,
});

export default HomePageClient;
