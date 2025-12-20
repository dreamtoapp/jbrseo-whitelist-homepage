import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background text-foreground antialiased relative overflow-hidden"
    >
      {/* Header skeleton (matches sticky HomeHeader layout) */}
      <header className="sticky top-0 z-40 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-2xl backdrop-saturate-150">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="hidden h-8 w-32 rounded-full sm:block" />
            <Skeleton className="hidden h-8 w-28 md:block rounded-full" />
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="hidden h-10 w-28 rounded-full sm:block" />
          </div>
        </div>
      </header>

      {/* Page content skeleton (matches Hero + Join + Footer + Floating CTA spacing) */}
      <div className="container mx-auto px-4 pt-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl">
          {/* Hero badge */}
          <div className="mb-6 flex justify-center">
            <Skeleton className="h-10 w-80 rounded-full" />
          </div>

          {/* Hero titles */}
          <div className="space-y-4 text-center">
            <Skeleton className="mx-auto h-10 w-3/4 rounded-lg" />
            <Skeleton className="mx-auto h-10 w-2/3 rounded-lg" />
          </div>

          {/* Hero description */}
          <div className="mt-5 space-y-3">
            <Skeleton className="mx-auto h-5 w-5/6 rounded-md" />
            <Skeleton className="mx-auto h-5 w-4/5 rounded-md" />
          </div>

          {/* Hero CTA + small text */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Skeleton className="h-12 w-56 rounded-full" />
            <Skeleton className="h-5 w-44 rounded-md" />
          </div>

          {/* Countdown */}
          <div className="mt-10 flex justify-center">
            <Skeleton className="h-16 w-full max-w-xl rounded-2xl" />
          </div>

          {/* Social proof stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-y border-foreground/10 py-6">
            <Skeleton className="h-16 w-40 rounded-2xl" />
            <Skeleton className="h-16 w-40 rounded-2xl" />
            <Skeleton className="h-16 w-40 rounded-2xl" />
          </div>

          {/* Optional hero image area */}
          <div className="mt-10">
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>

          {/* Features list (3 cards) */}
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>

          {/* Join section card */}
          <section className="relative py-16 md:py-20">
            <div className="mx-auto max-w-4xl">
              <div className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-64 w-full max-w-lg -translate-y-1/2 rounded-full bg-foreground/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/60 backdrop-blur-2xl backdrop-saturate-150">
                <div className="border-b border-foreground/10 bg-foreground/5 px-8 py-6 sm:px-10">
                  <div className="mx-auto mb-6 flex justify-center">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                  </div>
                  <div className="space-y-3 text-center">
                    <Skeleton className="mx-auto h-8 w-3/4 rounded-lg" />
                    <Skeleton className="mx-auto h-5 w-4/5 rounded-md" />
                    <Skeleton className="mx-auto h-8 w-64 rounded-full" />
                  </div>
                </div>

                {/* Form skeleton */}
                <div className="px-8 py-8 sm:px-10 sm:py-10 space-y-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-40 rounded-xl" />
                </div>

                {/* Trust + recent signups */}
                <div className="border-t border-foreground/10 px-8 py-6 sm:px-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
                    <Skeleton className="h-5 w-52 rounded-md" />
                    <Skeleton className="h-5 w-52 rounded-md" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-56 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer skeleton */}
          <footer className="border-t border-foreground/10 bg-foreground/5 py-10">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>

              <Skeleton className="h-4 w-56 rounded-md" />
            </div>
          </footer>
        </div>
      </div>

      {/* Reserve space for FloatingMobileCTA height on mobile */}
      <div className="h-20 sm:hidden" />
    </main>
  );
}

