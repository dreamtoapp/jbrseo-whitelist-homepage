import Link from "@/components/link";
import { redirect } from "next/navigation";

import { signIn, auth } from "@/auth";
import { prisma } from "@/helpers/prisma";
import { VerificationAlert } from "@/components/VerificationAlert";

function parseAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  const emails = raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  return new Set(emails);
}

const adminEmails = parseAdminEmails();

type Props = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    needsVerification?: string;
    email?: string;
  }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl, needsVerification, email } = await searchParams;
  const callbackUrlValue = (Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl) || "/";
  const showVerificationAlert = needsVerification === "true" && email;

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <main className="min-h-[calc(100vh-84px)] flex items-center justify-center">
        <div className="container mx-auto px-4 py-10 w-full">
          <div className="mx-auto max-w-md space-y-6">
            {showVerificationAlert && <VerificationAlert email={typeof email === "string" ? email : ""} />}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 space-y-6">
              <header className="space-y-2">
                <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
                <p className="text-sm text-foreground/70">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط دخول سريع.
                </p>
              </header>

              <form
                action={async (formData: FormData) => {
                  "use server";
                  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
                  const redirectTo = formData.get("callbackUrl")?.toString() || "/";
                  if (!email) return;

                  const emailLower = email.toLowerCase().trim();

                  if (adminEmails.has(emailLower)) {
                    await signIn("resend", { email, redirectTo });
                    return;
                  }

                  const subscriber = await prisma.subscriber.findUnique({
                    where: { email: emailLower },
                    select: { verified: true },
                  });

                  if (!subscriber) {
                    redirect(`/?error=not-registered`);
                    return;
                  }

                  if (!subscriber.verified) {
                    await signIn("resend", { email, redirectTo });
                    redirect(`/signin?needsVerification=true&email=${encodeURIComponent(emailLower)}`);
                    return;
                  }

                  await signIn("resend", { email, redirectTo });
                }}
                className="space-y-4"
              >
                <input type="hidden" name="callbackUrl" value={callbackUrlValue} />

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">البريد الإلكتروني</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="h-11 rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-foreground/10 hover:bg-foreground/20 border border-foreground/10 px-3 py-2 inline-flex justify-center items-center gap-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/30 sm:text-base"
                >
                  إرسال رابط الدخول
                </button>
              </form>

              <p className="text-xs text-foreground/60">
                بالمتابعة، أنت توافق على استخدام البريد لإرسال رابط الدخول.{" "}
                <Link href="/" className="underline underline-offset-4">
                  العودة للرئيسية
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

