"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const CountdownTimer = dynamic(
  () => import("./CountdownTimer").then((mod) => ({ default: mod.CountdownTimer })),
  { ssr: false }
);

type CountdownTimerDrawerProps = {
  targetDate: Date;
};

export function CountdownTimerDrawer({ targetDate }: CountdownTimerDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl border border-foreground/10 bg-foreground/5 p-2.5 text-foreground/70 transition-all hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label="عرض العد التنازلي"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="mb-6 text-center">
          <DrawerTitle className="text-2xl font-black">العد التنازلي للإطلاق</DrawerTitle>
          <DrawerDescription className="mt-2 text-base">
            الوقت المتبقي حتى الإطلاق الرسمي
          </DrawerDescription>
        </DrawerHeader>
        {open && (
          <div className="px-4 pb-6 ">
            <CountdownTimer targetDate={targetDate} />
          </div>
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  );
}
