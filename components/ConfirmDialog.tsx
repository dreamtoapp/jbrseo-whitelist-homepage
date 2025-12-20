"use client";

import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "إلغاء",
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            {icon && <span className="text-amber-500">{icon}</span>}
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base text-foreground/70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row-reverse gap-2 sm:gap-3">
          <AlertDialogAction asChild>
            <Button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-semibold shadow-lg bg-foreground text-background hover:bg-foreground/90"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialogAction>
          {cancelLabel && (
            <AlertDialogCancel asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-4 py-2 text-sm font-semibold"
                onClick={handleCancel}
              >
                {cancelLabel}
              </Button>
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}








