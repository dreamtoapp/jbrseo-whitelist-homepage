import { CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";
import cloudinaryLoader from "@/helpers/cloudinary-loader";
import { WhitelistFormTrigger } from "./WhitelistFormTrigger";
import type { HomePageContent } from "./HomePage";

type HeroSectionProps = {
  content: HomePageContent;
};

function HeroImageWithOverlay({ imageUrl, imageAlt }: { imageUrl: string; imageAlt: string | null | undefined }) {
  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl border border-border shadow-2xl shadow-foreground/5 md:rounded-3xl md:mb-16">
      <Image
        loader={cloudinaryLoader}
        src={imageUrl}
        alt={imageAlt || "صورة توضيحية"}
        width={1280}
        height={720}
        sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), (max-width: 1024px) 896px, 896px"
        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
        priority
        fetchPriority="high"
        quality={80}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
      <CTAOverlay />
    </div>
  );
}

function CTAOverlay() {
  return (
    <div className="absolute  inset-0 z-10 hidden items-center justify-center sm:flex">
      <div className="mx-auto max-w-md px-6 py-8">
        <div className="rounded-2xl border border-foreground/10 bg-background/90 backdrop-blur-2xl backdrop-saturate-150 p-8 shadow-2xl shadow-foreground/10">
          <div className="flex flex-col items-center justify-center gap-6">
            <WhitelistFormTrigger />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>30 ثانية فقط</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FallbackCTA() {
  return (
    <div className="mb-12 hidden flex-col items-center justify-center gap-4 sm:flex sm:flex-row sm:gap-6 md:mb-16">
      <WhitelistFormTrigger />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>30 ثانية فقط</span>
      </div>
    </div>
  );
}

function MobileBadge() {
  return (
    <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 sm:hidden" role="status" aria-label="مشروع سعودي - سجّل الآن للحصول على أولوية الوصول">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span className="font-bold whitespace-nowrap">سجّل الآن</span>
    </div>
  );
}

function HeroHeading({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <h1 className="font-black leading-tight tracking-tight text-[clamp(1.875rem,5vw,3.75rem)]">
      <span className="block text-foreground">{primary}</span>
      <span className="mt-2 block bg-linear-to-l from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        {secondary}
      </span>
    </h1>
  );
}

function HeroDescription({ description }: { description: string }) {
  return (
    <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground text-[clamp(1rem,2vw,1.25rem)]">
      {description}
    </p>
  );
}

function FeatureCard({ bullet, index }: { bullet: string; index: number }) {
  return (
    <li
      key={index}
      className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20" aria-hidden="true">
          <CheckCircle2 className="h-5 w-5 text-background" />
        </div>
        <span className="pt-1 text-sm font-medium leading-relaxed text-foreground/80 sm:text-base">
          {bullet}
        </span>
      </div>
    </li>
  );
}

function FeatureCards({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-12 grid gap-4 text-start sm:grid-cols-2 lg:grid-cols-3" role="list">
      {bullets.slice(0, 3).map((bullet, index) =>
        bullet ? <FeatureCard key={index} bullet={bullet} index={index} /> : null
      )}
    </ul>
  );
}

function SectionSeparator() {
  return (
    <div className="relative mt-16 md:mt-20">
      <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="relative flex items-center justify-center">
        <div className="rounded-full border border-emerald-500/20 bg-background/80 backdrop-blur-sm px-4 py-2 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-600" />
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ content }: HeroSectionProps) {
  const hasHeroImage = Boolean(content.heroImageUrl);

  return (
    <section className="relative pb-16 pt-4 md:pb-24 md:pt-8" id="content" aria-label="القسم الرئيسي">
      <div className="container mx-auto px-4 sm:px-6">
        <article className="mx-auto max-w-4xl text-center">
          {hasHeroImage ? (
            <HeroImageWithOverlay imageUrl={content.heroImageUrl as string} imageAlt={content.heroImageAlt ?? null} />
          ) : (
            <FallbackCTA />
          )}

          <MobileBadge />
          <HeroHeading primary={content.heroTitlePrimary} secondary={content.heroTitleSecondary} />
          <HeroDescription description={content.heroDescription} />
          <FeatureCards bullets={content.bullets} />
        </article>
      </div>

      <SectionSeparator />
    </section>
  );
}
