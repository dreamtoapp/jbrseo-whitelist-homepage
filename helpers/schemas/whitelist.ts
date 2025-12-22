import { z } from "zod";

export const whitelistSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(120, "الاسم طويل جدًا"),
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  mobile: z
    .string()
    .trim()
    .refine(
      (val) => val.length > 0,
      "رقم الجوال مطلوب"
    )
    .refine(
      (val) => /^\+\d{6,15}$/.test(val),
      "رقم الجوال يجب أن يكون بصيغة دولية صحيحة (مثال: +966501234567)"
    ),
  brandName: z.string().trim().min(1, "اسم العلامة مطلوب").max(120, "اسم العلامة طويل جدًا"),
});

export type WhitelistFormData = z.infer<typeof whitelistSchema>;

