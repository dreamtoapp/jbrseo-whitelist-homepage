import Link from "@/components/link";

export function SkipToContentLink() {
  return (
    <Link
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50 rounded-md bg-foreground/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/20"
      aria-label="تخطي إلى المحتوى الرئيسي"
    >
      تخطي إلى المحتوى
    </Link>
  );
}

