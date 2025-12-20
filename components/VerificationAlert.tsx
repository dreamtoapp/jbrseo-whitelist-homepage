"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { resendWhitelistVerification } from "@/app/hompage/actions/whitelist";
import { showSuccessNotification, showErrorNotification } from "@/helpers/toast";

type Props = {
  email: string;
};

export function VerificationAlert({ email }: Props) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  if (isDismissed) return null;

  async function handleResend() {
    setIsSending(true);
    try {
      const result = await resendWhitelistVerification(email);
      if (result.success) {
        showSuccessNotification("تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك.");
      } else if (result.error === "already_verified") {
        showSuccessNotification("البريد الإلكتروني مُتحقق مسبقًا.");
        setIsDismissed(true);
        router.refresh();
      } else if (result.error === "not_found") {
        showErrorNotification("البريد الإلكتروني غير موجود.");
      } else {
        showErrorNotification("تعذّر إرسال رابط التحقق. حاول لاحقًا.");
      }
    } catch (error) {
      showErrorNotification("حدث خطأ أثناء الإرسال. حاول لاحقًا.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-md mb-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            يرجى التحقق من بريدك الإلكتروني
          </p>
          <p className="text-xs text-amber-800/80 dark:text-amber-200/80">
            لإكمال التسجيل والاستفادة من جميع الميزات، يرجى التحقق من بريدك الإلكتروني.
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isSending}
            className="mt-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 text-xs font-medium text-white transition-colors"
          >
            {isSending ? "جاري الإرسال..." : "إرسال رابط التحقق"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 rounded-lg p-1 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}




















