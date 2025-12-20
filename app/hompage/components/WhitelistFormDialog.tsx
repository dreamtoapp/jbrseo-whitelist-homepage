"use client";

import dynamic from "next/dynamic";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomePageContent } from "./HomePage";

const WhitelistForm = dynamic(
  () => import("./WhitelistForm").then((mod) => ({ default: mod.WhitelistForm })),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    ),
    ssr: false,
  }
);

type WhitelistFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: HomePageContent;
};

export function WhitelistFormDialog({
  open,
  onOpenChange,
  content,
}: WhitelistFormDialogProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="mb-3 flex-shrink-0 text-center sm:mb-4">
          <DrawerTitle className="text-xl font-black sm:text-2xl">
            {content.joinTitle}
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-sm sm:mt-2 sm:text-base">
            {content.joinDescription}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-2 sm:pb-4">
          <WhitelistForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
