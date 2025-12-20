import Image from "next/image";
import Link from "@/components/link";
import { SocialIcon } from "./SocialIcon";

export type HomePageFooterContent = {
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

type HomePageFooterProps = {
  content: HomePageFooterContent;
};

export function HomePageFooter({ content }: HomePageFooterProps) {
  const hasSocialLinks =
    content.facebookUrl ||
    content.instagramUrl ||
    content.linkedinUrl ||
    content.twitterUrl ||
    content.whatsappCommunityUrl ||
    content.telegramChannelUrl;

  const socialLinks = [
    { url: content.facebookUrl, type: "facebook", label: "Facebook" },
    { url: content.instagramUrl, type: "instagram", label: "Instagram" },
    { url: content.linkedinUrl, type: "linkedin", label: "LinkedIn" },
    { url: content.twitterUrl, type: "twitter", label: "X" },
    { url: content.whatsappCommunityUrl, type: "whatsapp", label: "WhatsApp" },
    { url: content.telegramChannelUrl, type: "telegram", label: "Telegram" },
  ].filter((link) => link.url);

  return (
    <footer className="relative border-t border-foreground/10 bg-foreground/5" aria-label="التذييل" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col items-center gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="JBRseo Logo"
              width={36}
              height={36}
              className="h-8 w-8 rounded-lg opacity-80 object-contain"
              style={{ aspectRatio: "1/1" }}
            />
            <span className="text-base font-semibold text-foreground/70">JBRseo</span>
          </div>

          {/* Social Links */}
          {hasSocialLinks && (
            <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="روابط التواصل الاجتماعي">
              {socialLinks.map((link) => (
                <Link
                  key={link.type}
                  href={link.url!}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/10 hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`زيارة ${link.label}`}
                >
                  <SocialIcon type={link.type} />
                </Link>
              ))}
            </nav>
          )}

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/50">
            <Link
              href="#join"
              className="transition-colors hover:text-foreground/80"
            >
              {content.footerJoinLinkText}
            </Link>
            <span className="text-foreground/20">|</span>
            <Link
              href={`mailto:${content.footerContactEmail}`}
              className="transition-colors hover:text-foreground/80"
            >
              {content.footerContactText}
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-foreground/70">
            {content.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

