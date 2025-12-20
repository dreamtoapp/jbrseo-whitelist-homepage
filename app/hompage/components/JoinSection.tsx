import { CheckCircle2, Sparkles, Shield } from "lucide-react";
import { WhitelistForm } from "./WhitelistForm";
import type { HomePageContent } from "./HomePage";

type JoinSectionProps = {
  content: HomePageContent;
};

export function JoinSection({ content }: JoinSectionProps) {
  return (
    <section id="join" className="relative py-8 md:py-12 hidden md:block" aria-label="قسم الانضمام">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-64 w-full max-w-lg rounded-full bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/60 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-emerald-500/10">
            <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />

            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="p-8 sm:p-10 md:p-12 relative z-10">
              <div className="mb-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl bg-linear-to-l from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  {content.joinTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
                  {content.joinDescription}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>مجاني تماماً • بدون بطاقة ائتمان</span>
                </div>
              </div>

              <WhitelistForm />

              <div className="mt-10 flex flex-wrap items-center justify-center gap-5 border-t border-foreground/10 pt-8 text-xs text-foreground/50 sm:gap-6 sm:text-sm">
                <div className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500/70" />
                  <span>{content.privacyText}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500/70" />
                  <span>{content.badgeText}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
