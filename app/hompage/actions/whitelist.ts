"use server";

import { headers } from "next/headers";
import { prisma } from "@/helpers/prisma";
import { generateOtpCode, computeExpiryDate } from "@/helpers/otp";
import { generateRandomToken, hmacHash } from "@/helpers/tokens";
import { sendOtpEmail } from "@/helpers/email";
import type { WhitelistFormData } from "@/helpers/schemas/whitelist";

async function getLocationFromIP(ip: string | null): Promise<{ country: string | null; city: string | null }> {
  const isLoopback = !ip || ip === "::1" || ip === "127.0.0.1";

  try {
    const url = isLoopback
      ? `https://ipwho.is/?fields=city,country`
      : `https://ipwho.is/${ip}?fields=city,country`;

    const response = await fetch(url, { next: { revalidate: 0 } });
    const data = await response.json();
    return {
      country: data?.country || null,
      city: data?.city || null,
    };
  } catch {
    return { country: null, city: null };
  }
}

export async function submitWhitelist(data: WhitelistFormData) {
  try {
    const email = data.email.trim();
    const name = data.name.trim();
    const mobileRaw = data.mobile.trim();
    const mobile = mobileRaw.length > 0 ? mobileRaw : null;
    const brandName = data.brandName.trim();

    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });

    const headersList = await headers();
    const vercelForwarded = headersList.get("x-vercel-forwarded-for");
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIP = headersList.get("x-real-ip");
    const cfConnectingIp = headersList.get("cf-connecting-ip");
    const xClientIp = headersList.get("x-client-ip");
    const ip =
      vercelForwarded?.split(",")[0]?.trim() ||
      forwardedFor?.split(",")[0]?.trim() ||
      realIP ||
      cfConnectingIp ||
      xClientIp ||
      null;

    const location = await getLocationFromIP(ip);

    const proto = headersList.get("x-forwarded-proto") || "http";
    const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
    const baseUrl = `${proto}://${host}`;

    if (existingSubscriber) {
      const mobileUpdate = mobile ? { mobile } : {};
      if (existingSubscriber.verified) {
        await prisma.subscriber.update({
          where: { id: existingSubscriber.id },
          data: {
            name,
            brandName,
            ...mobileUpdate,
            country: location.country ?? existingSubscriber.country,
            city: location.city ?? existingSubscriber.city,
          },
        });

        return { success: true, status: "already_verified" as const };
      }

      await prisma.subscriber.update({
        where: { id: existingSubscriber.id },
        data: {
          name,
          brandName,
          ...mobileUpdate,
          country: location.country ?? existingSubscriber.country,
          city: location.city ?? existingSubscriber.city,
        },
      });

      return { success: true, status: "pending_verification" as const };
    }

    const otp = generateOtpCode();
    const otpHash = hmacHash(otp);
    const otpExpiresAt = computeExpiryDate();

    const rawVerifyToken = generateRandomToken(16);
    const verifyTokenHash = hmacHash(rawVerifyToken);
    const verifyTokenExpiresAt = computeExpiryDate();

    const created = await prisma.subscriber.create({
      data: {
        name,
        email,
        mobile,
        brandName,
        country: location.country,
        city: location.city,
        verified: false,
        otpCode: otpHash,
        otpExpiresAt,
        verifyToken: verifyTokenHash,
        verifyTokenExpiresAt,
      },
    });

    const link = `${baseUrl}/verify?token=${encodeURIComponent(rawVerifyToken)}`;

    await sendOtpEmail({ to: created.email, code: otp, link });

    return { success: true, location, requiresVerification: true, status: "new" as const };
  } catch (error) {
    console.error("submitWhitelist failed", error);
    return { success: false, error: "server" };
  }
}

export async function resendWhitelistVerification(email: string) {
  try {
    const normalizedEmail = email.trim();
    const subscriber = await prisma.subscriber.findUnique({ where: { email: normalizedEmail } });

    if (!subscriber) {
      return { success: false, error: "not_found" as const };
    }

    if (subscriber.verified) {
      return { success: false, error: "already_verified" as const };
    }

    const otp = generateOtpCode();
    const otpHash = hmacHash(otp);
    const otpExpiresAt = computeExpiryDate();

    const rawVerifyToken = generateRandomToken(16);
    const verifyTokenHash = hmacHash(rawVerifyToken);
    const verifyTokenExpiresAt = computeExpiryDate();

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        otpCode: otpHash,
        otpExpiresAt,
        verifyToken: verifyTokenHash,
        verifyTokenExpiresAt,
      },
    });

    const headersList = await headers();
    const proto = headersList.get("x-forwarded-proto") || "http";
    const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
    const baseUrl = `${proto}://${host}`;
    const link = `${baseUrl}/verify?token=${encodeURIComponent(rawVerifyToken)}`;

    await sendOtpEmail({ to: subscriber.email, code: otp, link });

    return { success: true };
  } catch (error) {
    console.error("resendWhitelistVerification failed", error);
    return { success: false, error: "server" as const };
  }
}


