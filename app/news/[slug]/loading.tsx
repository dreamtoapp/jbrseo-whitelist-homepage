import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Skeleton className="h-4 w-16 rounded-full" />
            <span>/</span>
            <Skeleton className="h-4 w-20 rounded-full" />
            <span>/</span>
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>

          <article className="space-y-8">
            <header className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-7 w-2/3 rounded-lg" />
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-4 w-28 rounded-full" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </header>

            {/* Excerpt card */}
            <div className="mb-4 rounded-2xl bg-foreground/5 border border-foreground/10 p-6 space-y-3">
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>

            {/* Footer link */}
            <div className="pt-8 border-t border-foreground/10">
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}










