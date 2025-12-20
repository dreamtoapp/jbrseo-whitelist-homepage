import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/helpers/prisma";

type Role = "ADMIN" | "CLIENT";

function parseAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  const emails = raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  return new Set(emails);
}

const adminEmails = parseAdminEmails();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
    error: "/auth-error",
  },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase().trim();
      if (!email) return false;

      if (adminEmails.has(email)) return true;

      const subscriber = await prisma.subscriber.findUnique({
        where: { email },
        select: { verified: true },
      });
      return subscriber !== null;
    },
    async jwt({ token }) {
      // Ensure token has role + user id in session
      if (!token.sub) return token;

      if (!token.role) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        token.role = (user?.role ?? "CLIENT") as Role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        if (token.role) session.user.role = token.role as Role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase().trim();
      if (!email) return;
      if (!adminEmails.has(email)) return;
      if (!user.id) return;

      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
    },
  },
});

