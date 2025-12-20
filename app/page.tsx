import { HomePage } from "./hompage/components/HomePage";
import type { Metadata } from "next";
import { prisma } from "@/helpers/prisma";

// Use ISR for the landing page to maximize performance and SEO
export const revalidate = 300;

async function getHomePageContent() {
  const content = await prisma.homePageConfig.findUnique({
    where: { key: "default" },
    select: {
      heroTitlePrimary: true,
      heroTitleSecondary: true,
      heroDescription: true,
      bullets: true,
      heroImageUrl: true,
      heroImageAlt: true,
      joinTitle: true,
      joinDescription: true,
      privacyText: true,
      badgeText: true,
      footerCopyright: true,
      footerJoinLinkText: true,
      footerContactEmail: true,
      footerContactText: true,
      facebookUrl: true,
      instagramUrl: true,
      linkedinUrl: true,
      twitterUrl: true,
      whatsappCommunityUrl: true,
      telegramChannelUrl: true,
    },
  });

  return (
    content ?? {
      heroTitlePrimary: "قريبًا…",
      heroTitleSecondary: "حضورك الرقمي لن يكون كما كان من قبل.",
      heroDescription:
        "فريق تقني وإبداعي يعمل بصمت على تجربة مختلفة كليًا. التفاصيل محجوبة الآن — لكن من ينضم مبكرًا سيعرف أولًا، وسيحصل على ميزة لا تتكرر.",
      bullets: [
        "ليست أداة تقليدية… بل نقلة في طريقة الحضور على الإنترنت.",
        "أذكى، أقوى، وأبسط — لأصحاب المواقع من كل الأنواع.",
        "وصول مبكر + مزايا خاصة للدفعة الأولى.",
      ],
      heroImageUrl: null,
      heroImageAlt: null,
      joinTitle: "انضم إلى القائمة البيضاء",
      joinDescription: "ضع بريدك الإلكتروني لتكون ضمن الدفعة الأولى من التجربة المغلقة.",
      privacyText: "لن نشارك بريدك. الدعوات تُرسل على دفعات.",
      badgeText: "مشروع سعودي — نسخة ما قبل الإطلاق",
      footerCopyright: "© 2025 — فكرة سعودية تُصنع بهدوء. جميع الحقوق محفوظة.",
      footerJoinLinkText: "القائمة البيضاء",
      footerContactEmail: "info@example.com",
      footerContactText: "تواصل",
      facebookUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      twitterUrl: null,
      whatsappCommunityUrl: null,
      telegramChannelUrl: null,
    }
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const content = await getHomePageContent();

  const ogImage =
    content.heroImageUrl && content.heroImageUrl.startsWith("http")
      ? content.heroImageUrl
      : `${siteUrl}/assets/logo.png`;

  return {
    alternates: { canonical: "/" },
    openGraph: {
      url: siteUrl,
      title: "JBRseo | مشروع سعودي لبناء حضور رقمي مبتكر",
      description: content.heroDescription,
      images: [ogImage],
    },
    twitter: {
      title: "JBRseo | مشروع سعودي لبناء حضور رقمي مبتكر",
      description: content.heroDescription,
      images: [ogImage],
    },
    description: content.heroDescription,
  };
}

export default async function Home() {
  const content = await getHomePageContent();
  return <HomePage content={content} />;
}
