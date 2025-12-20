"use client";

import { toast as sonnerToast } from "sonner";
import { ToastHeader } from "@/components/ui/toast-header";
import { CircleCheck, Info, OctagonX, X } from "lucide-react";

export function showSuccessNotification(message: string) {
  sonnerToast.custom(
    (id) => (
      <div
        className="relative rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4 shadow-lg dark:border-emerald-800 dark:bg-emerald-950 animate-in slide-in-from-top-5"
      >
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className="absolute left-2 top-2 rounded-md p-1 text-emerald-600 opacity-70 transition-opacity hover:opacity-100 dark:text-emerald-400"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
        <ToastHeader />
        <div className="flex items-start gap-3">
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="flex-1 text-sm font-medium text-emerald-900 dark:text-emerald-100">
            {message}
          </p>
        </div>
      </div>
    ),
    {
      duration: 10000,
    }
  );
}

export function showErrorNotification(message: string) {
  sonnerToast.custom(
    (id) => (
      <div
        className="relative rounded-lg border-2 border-red-200 bg-red-50 p-4 shadow-lg dark:border-red-800 dark:bg-red-950 animate-in slide-in-from-top-5"
      >
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className="absolute left-2 top-2 rounded-md p-1 text-red-600 opacity-70 transition-opacity hover:opacity-100 dark:text-red-400"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
        <ToastHeader />
        <div className="flex items-start gap-3">
          <OctagonX className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <p className="flex-1 text-sm font-medium text-red-900 dark:text-red-100">
            {message}
          </p>
        </div>
      </div>
    ),
    {
      duration: 10000,
    }
  );
}

export function showInfoNotification(message: string) {
  sonnerToast.custom(
    (id) => (
      <div
        className="relative rounded-lg border-2 border-blue-200 bg-blue-50 p-4 shadow-lg dark:border-blue-800 dark:bg-blue-950 animate-in slide-in-from-top-5"
      >
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className="absolute left-2 top-2 rounded-md p-1 text-blue-600 opacity-70 transition-opacity hover:opacity-100 dark:text-blue-400"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
        <ToastHeader />
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="flex-1 text-sm font-medium text-blue-900 dark:text-blue-100">
            {message}
          </p>
        </div>
      </div>
    ),
    {
      duration: 10000,
    }
  );
}



