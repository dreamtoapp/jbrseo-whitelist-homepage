import { z } from "zod";

export const whitelistSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(120, "الاسم طويل جدًا"),
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  mobile: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine(
      (val) => val.length === 0 || /^05\d{8}$/.test(val),
      "رقم الجوال يجب أن يكون 10 أرقام بصيغة 05xxxxxxxx"
    ),
  brandName: z.string().trim().min(1, "اسم العلامة مطلوب").max(120, "اسم العلامة طويل جدًا"),
});

export type WhitelistFormData = z.infer<typeof whitelistSchema>;

