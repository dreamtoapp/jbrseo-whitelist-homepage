import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "JBRseo <onboarding@resend.dev>"; // Resend-recommended test sender

if (!resendApiKey) {
  // Intentionally not throwing to avoid crashing dev; emails will be skipped.
  console.warn("RESEND_API_KEY is not set. OTP emails will be skipped.");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function getAssetBaseUrl(): string {
  const explicit = process.env.RESEND_ASSET_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelUrl = process.env.VERCEL_URL; // e.g. my-app.vercel.app
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;
  // Fallback to production domain if envs are missing
  return "https://jbrseo.com";
}

export function renderOtpEmailHtml(params: { code: string; link: string }) {
  const directLogoUrl = process.env.RESEND_EMAIL_LOGO_URL || process.env.RESEND_LOGO_URL;
  const logoUrl = directLogoUrl && /^https?:\/\//i.test(directLogoUrl)
    ? directLogoUrl
    : `${getAssetBaseUrl()}/assets/logo.png`;
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html dir="rtl" lang="ar">
  <body style="margin:0; padding:0; background-color:#f4f6fb;">
    <span style="display:none !important; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden;">
      رمز التحقق من JBRseo صالح لمدة 24 ساعة. إذا لم تطلب هذا البريد فتجاهله.
    </span>
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size:15px; line-height:1.7; background-color:#f4f6fb; padding:32px 16px;">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px; margin:0 auto; background-color:#ffffff; border-radius:18px; border:1px solid #e2e8f0; overflow:hidden;">
              <tbody>
                <tr>
                  <td style="padding:32px 32px 12px; text-align:center; background-color:#ffffff;">
                    <img src="${logoUrl}" alt="JBRseo" style="max-width:140px; width:100%; height:auto; display:inline-block; border:none; outline:none; text-decoration:none;" />
                    <p style="margin:16px 0 0; color:#64748b; font-size:13px;">منصة JBRseo</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 32px 32px;">
                    <h1 style="margin:0 0 12px; font-size:24px; font-weight:700; color:#0f172a;">تأكيد عنوان بريدك الإلكتروني</h1>
                    <p style="margin:0 0 16px; color:#1f2937; font-size:15px;">مرحبًا بك،</p>
                    <p style="margin:0 0 24px; color:#4b5563;">تم إنشاء رمز تحقق لحسابك على منصة <span style="font-weight:600; color:#0f172a;">JBRseo</span>. الرمز صالح لمدة <span style="font-weight:600;">24 ساعة</span> ويمكن استخدامه مرة واحدة فقط لإتمام التحقق.</p>

                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0 28px;">
                      <tbody>
                        <tr>
                          <td style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; text-align:center; padding:22px 16px;">
                            <div style="font-size:38px; font-weight:700; letter-spacing:10px; color:#1d4ed8;">${params.code}</div>
                            <p style="margin:10px 0 0; font-size:13px; color:#334155;">رمز صالح لمرة واحدة</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 22px; width:100%;">
                      <tbody>
                        <tr>
                          <td align="center">
                            <a href="${params.link}" target="_blank" rel="noopener" style="display:inline-block; padding:12px 28px; background-color:#2563eb; color:#ffffff; font-weight:600; font-size:15px; border-radius:999px; text-decoration:none;">إكمال التحقق الآن</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p style="margin:0 0 18px; color:#4b5563;">إذا لم يعمل الزر أعلاه، يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
                    <p style="margin:0 0 24px; direction:ltr; text-align:left; font-size:13px; color:#1d4ed8; word-break:break-all;">${params.link}</p>

                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0 28px; background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
                      <tbody>
                        <tr>
                          <td style="padding:18px 22px;">
                            <p style="margin:0 0 8px; font-weight:600; color:#0f172a;">تذكيرات مهمة</p>
                            <ul style="margin:0; padding:0 18px; color:#475569; font-size:13px; line-height:1.7;">
                              <li>لا تشارك رمز التحقق مع أي شخص.</li>
                              <li>إذا لم تطلب هذا البريد، يرجى تجاهله أو التواصل مع دعم JBRseo.</li>
                              <li>بعد انتهاء صلاحية الرمز يمكنك طلب رمز جديد من صفحة التحقق.</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p style="margin:0; color:#4b5563;">هذا البريد للإعلام فقط. لا حاجة للرد عليه؛ ولأي مساعدة إضافية تواصل معنا عبر قنوات الدعم الرسمية.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#0f172a; padding:24px 32px; color:rgba(226, 232, 240, 0.8); font-size:12px; text-align:center;">
                    <p style="margin:0 0 8px;">وصلتك هذه الرسالة لأنك طلبت التحقق من بريدك في JBRseo.</p>
                    <p style="margin:0 0 6px;">إذا لم تكن صاحب الطلب يرجى تجاهل الرسالة.</p>
                    <p style="margin:0;">© ${new Date().getFullYear()} JBRseo. جميع الحقوق محفوظة.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
}

export function renderOtpEmailText(params: { code: string; link: string }) {
  return `رمز التحقق من JBRseo: ${params.code}\n\nالرمز صالح لمدة 24 ساعة. انقر أو انسخ الرابط التالي لإكمال التحقق:\n${params.link}\n\nإذا لم تطلب هذا البريد فتجاهله. لا ترد على هذه الرسالة؛ تواصل مع دعم JBRseo عند الحاجة.`;
}

export async function sendOtpEmail(params: { to: string; code: string; link: string }) {
  try {
    if (!resend) return { sent: false };
    const textBody = renderOtpEmailText(params);
    await resend.emails.send({
      from: resendFrom,
      to: params.to,
      subject: "تأكيد البريد الإلكتروني",
      html: renderOtpEmailHtml({ code: params.code, link: params.link }),
      text: textBody,
    });
    return { sent: true };
  } catch (error) {
    console.error("Failed to send OTP email", error);
    return { sent: false };
  }
}


