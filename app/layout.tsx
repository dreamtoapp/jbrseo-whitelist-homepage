import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { GTMProvider } from "@/components/GTMProvider";
import { HomeHeader } from "@/components/HomeHeader";
import { HomePageFooter, type HomePageFooterContent } from "@/components/HomePageFooter";
import { prisma } from "@/helpers/prisma";
import { cacheTag, cacheLife } from "next/cache";
import "./globals.css";

const NotificationHandler = dynamic(
  () => import("@/components/NotificationHandler").then((mod) => ({ default: mod.NotificationHandler }))
);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
const defaultTitle = "JBRseo | مشروع سعودي لبناء حضور رقمي مبتكر";
const defaultDescription =
  "JBRseo منصة سعودية تمنحك حضورًا رقميًا متكاملًا، من الفكرة إلى الإطلاق، مع تجربة حصرية مخصصة لأوائل المنضمين.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | JBRseo",
  },
  description: defaultDescription,
  keywords: [
    "JBRseo",
    "منصة رقمية",
    "حضور رقمي",
    "سعودية",
    "تقنية",
    "موقع إلكتروني",
    "تجربة مستخدم",
  ],
  creator: "JBRseo Team",
  publisher: "JBRseo",
  authors: [{ name: "JBRseo Team" }],
  category: "Technology",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName: "JBRseo",
    images: [
      {
        url: "/assets/logo.png",
        width: 512,
        height: 512,
        alt: "شعار JBRseo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
  },
  other: {
    "mobile-web-app-capable": "no",
    "apple-mobile-web-app-capable": "no",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "optional",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  variable: "--font-tajawal",
});

async function getHomePageContent(): Promise<HomePageFooterContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("homepage-footer");

  const content = await prisma.homePageConfig.findUnique({
    where: { key: "default" },
    select: {
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerContent = await getHomePageContent();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={tajawal.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <Toaster />
          <Suspense fallback={null}>
            <NotificationHandler />
          </Suspense>
          <Suspense fallback={<div className="h-16 md:h-20" />}>
            <HomeHeader />
          </Suspense>
          {children}
          <HomePageFooter content={footerContent} />
          <Suspense fallback={null}>
            <GTMProvider />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

