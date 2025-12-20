import crypto from "crypto";

const CODE_LENGTH = 4;
const OTP_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateOtpCode(): string {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  return code.padStart(CODE_LENGTH, "0");
}

export function hashValue(value: string, salt?: string): { hash: string; salt: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHmac("sha256", usedSalt).update(value).digest("hex");
  return { hash, salt: usedSalt };
}

export function verifyHash(value: string, salt: string, expectedHash: string): boolean {
  const { hash } = hashValue(value, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}

export function computeExpiryDate(now = new Date()): Date {
  return new Date(now.getTime() + OTP_TTL_MS);
}


