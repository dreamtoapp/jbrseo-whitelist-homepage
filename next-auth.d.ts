import "next-auth";
import "next-auth/jwt";

type Role = "ADMIN" | "CLIENT";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

