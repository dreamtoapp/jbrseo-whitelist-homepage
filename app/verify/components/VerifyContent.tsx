"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyOtpWithToken, resendOtp } from "../actions/verify";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type VerifyOtpSuccess = { success: true; alreadyVerified?: true };
type VerifyOtpErrorCode =
  | "not_found"
  | "token_expired"
  | "otp_missing"
  | "otp_expired"
  | "otp_invalid"
  | "server";
type VerifyOtpFailure = { success: false; error: VerifyOtpErrorCode };
type VerifyOtpResult = VerifyOtpSuccess | VerifyOtpFailure;

type ResendOtpErrorCode = "not_found" | "already_verified" | "server";
type ResendOtpResult = { success: true } | { success: false; error: ResendOtpErrorCode };

export function VerifyContent() {
  const search = useSearchParams();
  const token = search.get("token") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const id = window.setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownSeconds]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setMessage("رابط التحقق غير صالح.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = (await verifyOtpWithToken(token, code.trim())) as VerifyOtpResult;
    if (res.success && res.alreadyVerified) {
      setMessage("هذا البريد الإلكتروني مُتحقق مسبقًا.");
    } else if (res.success) {
      setMessage("تم التحقق من البريد الإلكتروني بنجاح.");
    } else {
      const err = res.error;
      if (err === "otp_expired") setMessage("انتهت صلاحية الرمز. يرجى طلب رمز جديد.");
      else if (err === "otp_invalid") setMessage("الرمز غير صحيح. حاول مرة أخرى.");
      else if (err === "otp_missing") setMessage("لا يوجد رمز حالي. يرجى طلب رمز جديد.");
      else if (err === "token_expired") setMessage("انتهت صلاحية رابط التحقق. يرجى إعادة إرسال رمز جديد.");
      else if (err === "not_found") setMessage("رابط التحقق غير صالح أو منتهي.");
      else setMessage("تعذر إتمام التحقق الآن. حاول لاحقًا.");
    }
    setLoading(false);
  }

  async function onResend() {
    if (!token) {
      setMessage("رابط التحقق غير صالح.");
      return;
    }
    setResending(true);
    const res = (await resendOtp(token)) as ResendOtpResult;
    setResending(false);
    if (res.success) {
      setMessage("تم إرسال رمز جديد إلى بريدك.");
      setCooldownSeconds(60);
    } else if (res.error === "already_verified") {
      setMessage("هذا البريد الإلكتروني مُتحقق مسبقًا.");
    } else if (res.error === "not_found") {
      setMessage("رابط التحقق غير صالح أو منتهي.");
    } else {
      setMessage("تعذر إرسال رمز جديد الآن. حاول لاحقًا.");
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-foreground/10 bg-foreground/[0.05] backdrop-blur-xl p-8">
        <h1 className="text-2xl font-bold mb-2">تأكيد البريد الإلكتروني</h1>
        <p className="text-foreground/70 mb-2">نحتاج لتأكيد بريدك لإكمال الانضمام وإرسال الدعوات والتحديثات بشكل آمن.</p>
        <p className="text-foreground/70 mb-6">الرمز صالح لمدة 24 ساعة. إذا لم تجد الرسالة، راجع الرسائل غير المرغوبة/الترويجية ثم أدخل رمز التحقق.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="code" className="text-sm">رمز التحقق</label>
            <InputOTP
              id="code"
              name="code"
              value={code}
              onChange={setCode}
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              required
              containerClassName="w-full justify-center"
            >
              <InputOTPGroup dir="ltr" className="w-full justify-center gap-2">
                <InputOTPSlot index={0} className="h-11 w-11 rounded-xl bg-foreground/[0.05] border border-foreground/15" />
                <InputOTPSlot index={1} className="h-11 w-11 rounded-xl bg-foreground/[0.05] border border-foreground/15" />
                <InputOTPSlot index={2} className="h-11 w-11 rounded-xl bg-foreground/[0.05] border border-foreground/15" />
                <InputOTPSlot index={3} className="h-11 w-11 rounded-xl bg-foreground/[0.05] border border-foreground/15" />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-foreground/60">أدخل 4 أرقام.</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-foreground/20 hover:bg-foreground/30 text-foreground font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            {loading ? "جاري التحقق..." : "تأكيد"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          {message ? <p className="text-sm text-foreground/80">{message}</p> : <span />}
          <button
            type="button"
            onClick={onResend}
            disabled={!token || resending || cooldownSeconds > 0}
            className="text-sm underline hover:opacity-80 disabled:opacity-50"
          >
            {resending
              ? "جاري الإرسال..."
              : cooldownSeconds > 0
                ? `إعادة الإرسال خلال ${cooldownSeconds}ث`
                : "إعادة إرسال الرمز"}
          </button>
        </div>
      </div>
    </div>
  );
}

