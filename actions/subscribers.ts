"use server";

import { auth } from "@/auth";
import { prisma } from "@/helpers/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("unauthorized");
  }
  return session;
}

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  mobile: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => val.length === 0 || /^\+[1-9]\d{1,14}$/.test(val)),
  brandName: z.string().trim().min(1).max(120),
  verified: z.boolean(),
});

export type UpdateSubscriberInput = z.infer<typeof updateSchema>;

export async function updateSubscriber(id: string, input: UpdateSubscriberInput) {
  try {
    await requireAdmin();
    const data = updateSchema.parse(input);

    // If email changes, ensure uniqueness
    const existing = await prisma.subscriber.findFirst({
      where: { email: data.email, NOT: { id } },
      select: { id: true },
    });
    if (existing) return { success: false, error: "email_taken" } as const;

    await prisma.subscriber.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        mobile: data.mobile.length > 0 ? data.mobile : null,
        brandName: data.brandName,
        verified: data.verified,
      },
    });

    return { success: true } as const;
  } catch (error) {
    console.error("updateSubscriber failed", error);
    return { success: false, error: "server" } as const;
  }
}

export async function softDeleteSubscriber(id: string) {
  try {
    await requireAdmin();
    // Deprecated: kept for backward compatibility
    await prisma.subscriber.delete({ where: { id } });
    return { success: true } as const;
  } catch (error) {
    console.error("softDeleteSubscriber failed", error);
    return { success: false, error: "server" } as const;
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await requireAdmin();
    await prisma.subscriber.delete({ where: { id } });
    return { success: true } as const;
  } catch (error) {
    console.error("deleteSubscriber failed", error);
    return { success: false, error: "server" } as const;
  }
}


