// ============================================================
// 🎓 Booking Controller — Ultra Genesis AI Edition
// ============================================================
import Booking from "../models/Booking.js";
import { sendBookingEmail } from "../utils/mailer.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ ایجاد جلسه جدید با تحلیل هوش مصنوعی
export const createBooking = async (req, res) => {
  try {
    const { name, email, studyLevel, facultyInterest, goalText, preferredDates } = req.body;

    if (!name || !email)
      return res.status(400).json({ success: false, error: "نام و ایمیل الزامی است" });

    // 🧠 تحلیل توسط AI
    const prompt = `
    کاربر: ${name}
    مقطع: ${studyLevel}
    هدف: ${goalText}
    علاقه‌مندی: ${facultyInterest}

    لطفاً یک خلاصه‌ی حرفه‌ای از مسیر تحصیلی پیشنهادی با تمرکز بر آینده شغلی ارائه بده.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Mmdrza Ultra Advisor, a world-class AI study consultant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const aiText = aiResponse.choices?.[0]?.message?.content || "پاسخی از هوش مصنوعی دریافت نشد.";

    const booking = new Booking({
      name,
      email,
      studyLevel,
      facultyInterest,
      goalText,
      preferredDates,
      aiSummary: aiText.slice(0, 300),
      aiRecommendation: aiText,
    });

    await booking.save();
    await sendBookingEmail(email, booking);

    res.json({
      success: true,
      message: "✅ جلسه مشاوره با موفقیت ایجاد شد!",
      booking,
    });
  } catch (err) {
    console.error("❌ Booking Error:", err);
    res.status(500).json({ success: false, error: "خطا در ایجاد جلسه" });
  }
};
