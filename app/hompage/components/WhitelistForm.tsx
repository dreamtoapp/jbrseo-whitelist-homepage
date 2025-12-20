"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { whitelistSchema, type WhitelistFormData } from "@/helpers/schemas/whitelist";
import { submitWhitelist, resendWhitelistVerification } from "../actions/whitelist";
import { showSuccessNotification, showErrorNotification, showInfoNotification } from "@/helpers/toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type z } from "zod";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function WhitelistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
  const [resendEmail, setResendEmail] = useState<string | null>(null);

  type WhitelistFormFields = z.input<typeof whitelistSchema>;

  const form = useForm<WhitelistFormFields, undefined, WhitelistFormData>({
    resolver: zodResolver(whitelistSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      brandName: "",
    } satisfies WhitelistFormFields,
  });

  const handleConfirmResend = async () => {
    if (!resendEmail) {
      setIsResendDialogOpen(false);
      return;
    }

    const resendResponse = await resendWhitelistVerification(resendEmail);
    if (resendResponse.success) {
      showSuccessNotification(
        "تم إرسال رمز تحقق جديد. تفقد بريدك الإلكتروني لإكمال التفعيل، وإذا لم تجده في البريد الوارد فراجع مجلد الرسائل غير المرغوبة أو الترويجية وانقلها إلى البريد الوارد."
      );
    } else if (resendResponse.error === "already_verified") {
      showInfoNotification("تم التحقق من بريدك بالفعل. سنوافيك بالتحديثات قريبًا.");
    } else if (resendResponse.error === "not_found") {
      showErrorNotification("تعذّر العثور على بريدك. حاول التسجيل مرة أخرى.");
    } else {
      showErrorNotification("تعذّر إعادة إرسال الرمز الآن. حاول لاحقًا.");
    }

    setIsResendDialogOpen(false);
  };

  const handleCancelResend = () => {
    setIsResendDialogOpen(false);
    showInfoNotification("يمكنك إعادة فتح رابط التحقق السابق في بريدك لإكمال العملية متى أردت.");
  };

  async function onSubmit(data: WhitelistFormData) {
    setIsSubmitting(true);
    try {
      const result = await submitWhitelist(data);
      if (result.success) {
        const status = (result as { status?: string }).status;

        if (status === "already_verified") {
          showInfoNotification("حسابك مسجل ومؤكَّد بالفعل. نعمل على تجهيز التحديثات القادمة ونبلغك فور توفرها.");
          return;
        }

        if (status === "pending_verification") {
          setResendEmail(data.email.trim());
          setIsResendDialogOpen(true);
          return;
        }

        showSuccessNotification(
          "تم استلام تسجيلك. يرجى فتح الرسالة في بريدك والنقر على رابط التحقق ثم إدخال رمز OTP لإكمال التأكيد. إذا لم تجد الرسالة في البريد الوارد، تحقق من مجلد الرسائل غير المرغوبة أو الترويجية وانقلها إلى البريد الوارد."
        );
        form.reset();

        if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag && result.location) {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "whitelist_signup", {
            country: result.location.country || "unknown",
            city: result.location.city || "unknown",
          });
        }
      } else {
        showErrorNotification("تعذّر الإرسال مؤقتًا. حاول لاحقًا.");
      }
    } catch (error) {
      showErrorNotification("تعذّر الإرسال مؤقتًا. حاول لاحقًا.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2.5 sm:gap-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                البريد الإلكتروني <span className="text-emerald-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  className="h-10 rounded-xl sm:h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                الاسم <span className="text-emerald-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="خالد العلي"
                  autoComplete="name"
                  className="h-10 rounded-xl sm:h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                العلامة التجارية <span className="text-emerald-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="اسم شركتك أو مشروعك"
                  autoComplete="organization"
                  className="h-10 rounded-xl sm:h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground/70">
                رقم الجوال <span className="text-muted-foreground/70 text-xs font-normal">(اختياري)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="مثال: 0501234567"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={10}
                  className="h-10 rounded-xl sm:h-11"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground/60">
                {field.value.length}/10 أرقام
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-10 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-background hover:bg-emerald-700 disabled:opacity-50 sm:h-11 sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري التسجيل...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              احجز مكانك الآن — مجاناً
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/70">
          <Lock className="h-3 w-3" />
          <span>بياناتك آمنة ومشفرة • لن نشاركها مع أي طرف</span>
        </div>
      </form>
      <ConfirmDialog
        open={isResendDialogOpen}
        title="بريدك بحاجة لتأكيد"
        description="بريدك مسجل لدينا لكن لم يتم التحقق بعد. هل ترغب في إعادة إرسال رمز التحقق الآن؟"
        confirmLabel="أعد إرسال الرمز"
        cancelLabel="لاحقًا"
        onConfirm={handleConfirmResend}
        onCancel={handleCancelResend}
      />
    </Form>
  );
}
