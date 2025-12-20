import Link from "@/components/link";

export default async function VerifyRequestPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <main className="min-h-[calc(100vh-84px)]">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-md space-y-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
            <header className="space-y-2">
              <h1 className="text-2xl font-bold">تحقق من بريدك</h1>
              <p className="text-sm text-foreground/70">
                أرسلنا لك رابط تسجيل الدخول. افتح بريدك واضغط على الرابط لإكمال الدخول.
              </p>
            </header>

            <div className="space-y-2 text-sm text-foreground/70">
              <p>إذا لم تجد الرسالة، تحقق من البريد غير الهام (Spam) أو قسم العروض.</p>
              <p>قد يستغرق وصول الرسالة دقيقة أو دقيقتين.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Link
                href="/signin"
                className="rounded-xl bg-foreground/10 hover:bg-foreground/20 border border-foreground/10 px-3 py-2 inline-flex w-full justify-center items-center gap-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/30 sm:text-base sm:w-auto"
              >
                رجوع لتسجيل الدخول
              </Link>
              <Link
                href="/"
                className="rounded-xl bg-foreground/10 hover:bg-foreground/20 border border-foreground/10 px-3 py-2 inline-flex w-full justify-center items-center gap-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/30 sm:text-base sm:w-auto"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

