// ============================================================
// 📧 Mmdrza Ultra Genesis Mailer — v2.1 Final
// ============================================================

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ⚙️ پیکربندی SMTP (مثل Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ ارسال ایمیل تأیید ثبت‌نام (برای auth)
export async function sendVerificationEmail(email, code) {
  const html = `
  <div style="font-family:'Vazir',sans-serif;direction:rtl;background:#0b1120;padding:30px;color:#fff;">
    <div style="background:#111827;border:1px solid #38bdf8;border-radius:14px;padding:20px;max-width:550px;margin:auto;">
      <h2 style="color:#38bdf8;text-align:center;">کد تأیید حساب کاربری</h2>
      <p style="text-align:center;">کاربر گرامی، برای ادامه فرآیند ثبت‌نام لطفاً کد زیر را وارد کنید:</p>
      <h1 style="text-align:center;letter-spacing:8px;color:#22d3ee;">${code}</h1>
      <p style="text-align:center;color:#94a3b8;">این کد تا <b>۵ دقیقه</b> معتبر است.</p>
      <hr style="border-color:#38bdf8;opacity:0.3;margin:20px 0;">
      <p style="text-align:center;font-size:13px;color:#64748b;">© 2025 Mmdrza Ultra Genesis AI Advisor</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Mmdrza Ultra Advisor" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "کد تأیید حساب کاربری ✅",
    html,
  });
}

// ✅ ارسال ایمیل تأیید رزرو جلسه
export async function sendBookingEmail(email, booking) {
  const html = `
  <div style="font-family:'Vazir',sans-serif;direction:rtl;background:#0b1120;padding:30px;color:#fff;">
    <div style="background:#111827;border:1px solid #38bdf8;border-radius:14px;padding:20px;max-width:600px;margin:auto;">
      <h2 style="color:#38bdf8;text-align:center;">تأیید جلسه مشاوره تحصیلی 🎓</h2>
      <p><b>نام:</b> ${booking.name}</p>
      <p><b>ایمیل:</b> ${booking.email}</p>
      <p><b>مقطع تحصیلی:</b> ${booking.studyLevel || "-"}</p>
      <p><b>رشته مورد علاقه:</b> ${booking.facultyInterest || "-"}</p>
      <p><b>هدف:</b> ${booking.goalText || "-"}</p>
      <hr style="border-color:#38bdf8;opacity:0.3;margin:15px 0;">
      <h4 style="color:#22d3ee;">✨ خلاصه AI:</h4>
      <p>${booking.aiSummary || "تحلیل در دسترس نیست."}</p>
      <h4 style="color:#22d3ee;">🧠 پیشنهاد هوش مصنوعی:</h4>
      <p>${booking.aiRecommendation || ""}</p>
      <hr style="border-color:#38bdf8;opacity:0.3;margin:20px 0;">
      <p style="text-align:center;font-size:13px;color:#64748b;">© 2025 Mmdrza Ultra Genesis AI Advisor</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Mmdrza Ultra Advisor" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "📅 تأیید جلسه مشاوره شما",
    html,
  });
}
