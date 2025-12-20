import dynamic from "next/dynamic";
import { SkipToContentLink } from "./SkipToContentLink";
import { StructuredDataScript } from "./StructuredDataScript";
import { HeroSectionWithProvider } from "./HeroSectionWithProvider";
import { JoinSection } from "./JoinSection";

const FloatingMobileCTAWithProvider = dynamic(
  () => import("./FloatingMobileCTAWithProvider").then((mod) => ({ default: mod.FloatingMobileCTAWithProvider }))
);

export type HomePageContent = {
  heroTitlePrimary: string;
  heroTitleSecondary: string;
  heroDescription: string;
  bullets: string[];
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  joinTitle: string;
  joinDescription: string;
  privacyText: string;
  badgeText: string;
  footerCopyright: string;
  footerJoinLinkText: string;
  footerContactEmail: string;
  footerContactText: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  whatsappCommunityUrl?: string | null;
  telegramChannelUrl?: string | null;
};

export async function HomePage({ content }: { content: HomePageContent }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "JBRseo",
        url: siteUrl,
        logo: `${siteUrl}/assets/logo.png`,
        foundingLocation: {
          "@type": "Place",
          addressCountry: "SA",
          name: "Saudi Arabia",
        },
        sameAs: [
          content.facebookUrl,
          content.instagramUrl,
          content.linkedinUrl,
          content.twitterUrl,
          content.whatsappCommunityUrl,
          content.telegramChannelUrl,
        ].filter(Boolean) as string[],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: "JBRseo",
        inLanguage: "ar",
        description: content.heroDescription,
        publisher: {
          "@id": `${siteUrl}#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}#webpage`,
        url: siteUrl,
        name: content.heroTitlePrimary,
        description: content.heroDescription,
        inLanguage: "ar",
        isPartOf: {
          "@id": `${siteUrl}#website`,
        },
        about: {
          "@id": `${siteUrl}#organization`,
        },
      },
    ],
  } satisfies Record<string, unknown>;

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-background text-foreground antialiased">
      <StructuredDataScript structuredData={structuredData} />
      <SkipToContentLink />
      <div className="relative overflow-hidden">
        <HeroSectionWithProvider content={content} />
        <JoinSection content={content} />
        <FloatingMobileCTAWithProvider content={content} />
      </div>
    </main>
  );
}
