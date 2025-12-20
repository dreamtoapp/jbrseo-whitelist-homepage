import Link from "@/components/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="container mx-auto px-4 py-10 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">المنشور غير موجود</h2>
          <p className="text-foreground/70">
            عذرًا، المنشور الذي تبحث عنه غير موجود أو تم حذفه.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}



















