"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { showSuccessNotification, showErrorNotification } from "@/helpers/toast";

export function NotificationHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    const error = searchParams.get("error");

    if (status === "ok") {
      showSuccessNotification("تم استلام طلبك. سنرسل الدعوات على دفعات، وإذا لم تجد رسالتنا في البريد الوارد فتفقد مجلد الرسائل غير المرغوبة أو الترويجية وانقلها إلى البريد الوارد.");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("status");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    } else if (error === "invalid-email") {
      showErrorNotification("البريد الإلكتروني غير صحيح. يرجى التحقق من البريد المدخل.");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    } else if (error === "duplicate") {
      showErrorNotification("البريد الإلكتروني مسجل مسبقاً في القائمة البيضاء.");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    } else if (error === "server") {
      showErrorNotification("تعذّر الإرسال مؤقتًا. حاول لاحقًا.");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    } else if (error === "invalid") {
      showErrorNotification("كلمة المرور غير صحيحة");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    } else if (error === "not-registered") {
      showErrorNotification("البريد الإلكتروني غير مسجل في القائمة البيضاء. يرجى التسجيل في القائمة البيضاء أولاً.");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    } else if (error === "not-verified") {
      showErrorNotification("البريد الإلكتروني غير مفعّل. يرجى التحقق من بريدك الإلكتروني أولاً.");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const hash = window.location.hash;
      const newUrl = newParams.toString() ? `?${newParams.toString()}${hash}` : `${window.location.pathname}${hash}`;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  return null;
}

