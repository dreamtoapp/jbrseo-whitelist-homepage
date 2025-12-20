import crypto from "crypto";

const secret = process.env.EMAIL_VERIFY_SECRET || "dev-secret";

export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function hmacHash(value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function verifyHmac(value: string, expectedHash: string): boolean {
  const actual = hmacHash(value);
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expectedHash));
}





