import Link from "@/components/link";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function AuthErrorPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorValue = Array.isArray(error) ? error[0] : error;

  const getErrorMessage = () => {
    if (errorValue === "Verification") {
      return {
        title: "خطأ في التحقق",
        message: "رابط التحقق غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.",
      };
    }
    return {
      title: "حدث خطأ",
      message: "حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    };
  };

  const { title, message } = getErrorMessage();

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <main className="min-h-[calc(100vh-84px)] flex items-center justify-center">
        <div className="container mx-auto px-4 py-10 w-full">
          <div className="mx-auto max-w-md space-y-6">
            <div className="rounded-2xl border border-red-500/30 bg-red-50/50 dark:bg-red-950/20 p-6 space-y-6">
              <header className="space-y-2">
                <h1 className="text-2xl font-bold text-red-900 dark:text-red-100">{title}</h1>
                <p className="text-sm text-red-800/80 dark:text-red-200/80">{message}</p>
              </header>

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
        </div>
      </main>
    </div>
  );
}



















