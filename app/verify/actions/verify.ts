"use server";

import { headers } from "next/headers";
import { prisma } from "@/helpers/prisma";
import { hmacHash, verifyHmac } from "@/helpers/tokens";
import { generateOtpCode, computeExpiryDate } from "@/helpers/otp";
import { sendOtpEmail } from "@/helpers/email";

function getAbsoluteBaseUrlFromEnv(): string {
  const explicit = process.env.RESEND_ASSET_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;
  return "https://jbrseo.com";
}

async function getAbsoluteBaseUrlFromRequest(): Promise<string | null> {
  try {
    const headersList = await headers();
    const proto = headersList.get("x-forwarded-proto") || "http";
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    if (!host) return null;
    return `${proto}://${host}`.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export async function verifyOtpWithToken(token: string, code: string) {
  try {
    const tokenHash = hmacHash(token);
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        verifyToken: tokenHash,
      },
    });

    if (!subscriber) {
      return { success: false, error: "not_found" } as const;
    }

    if (subscriber.verified) {
      return { success: true, alreadyVerified: true } as const;
    }

    if (subscriber.verifyTokenExpiresAt && subscriber.verifyTokenExpiresAt < new Date()) {
      return { success: false, error: "token_expired" } as const;
    }

    if (!subscriber.otpCode || !subscriber.otpExpiresAt) {
      return { success: false, error: "otp_missing" } as const;
    }

    if (subscriber.otpExpiresAt < new Date()) {
      return { success: false, error: "otp_expired" } as const;
    }

    const ok = verifyHmac(code, subscriber.otpCode);
    if (!ok) {
      return { success: false, error: "otp_invalid" } as const;
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
        otpCode: null,
        otpExpiresAt: null,
        verifyToken: null,
        verifyTokenExpiresAt: null,
      },
    });

    return { success: true } as const;
  } catch (error) {
    console.error("verifyOtpWithToken failed", error);
    return { success: false, error: "server" } as const;
  }
}

export async function resendOtp(token: string) {
  try {
    const tokenHash = hmacHash(token);
    const subscriber = await prisma.subscriber.findFirst({
      where: { verifyToken: tokenHash },
    });

    if (!subscriber) return { success: false, error: "not_found" } as const;
    if (subscriber.verified) return { success: false, error: "already_verified" } as const;

    const newCode = generateOtpCode();
    const newHash = hmacHash(newCode);
    const newExpiry = computeExpiryDate();
    const newTokenExpiry = computeExpiryDate();

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { otpCode: newHash, otpExpiresAt: newExpiry, verifyTokenExpiresAt: newTokenExpiry },
    });

    const baseUrl = (await getAbsoluteBaseUrlFromRequest()) ?? getAbsoluteBaseUrlFromEnv();
    const link = `${baseUrl}/verify?token=${encodeURIComponent(token)}`;
    await sendOtpEmail({ to: subscriber.email, code: newCode, link });

    return { success: true } as const;
  } catch (error) {
    console.error("resendOtp failed", error);
    return { success: false, error: "server" } as const;
  }
}


