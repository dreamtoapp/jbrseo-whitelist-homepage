import { Suspense } from "react";
import { VerifyContent } from "./components/VerifyContent";

export default async function VerifyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="min-h-[calc(100vh-84px)] flex items-center justify-center">جاري التحميل…</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}


