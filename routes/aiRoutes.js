// ============================================================
// 🤖 AI Routes — Mmdrza Ultra Genesis AI Interface
// ============================================================
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// 🧠 Chat Endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ success: false, error: "متن پیام الزامی است" });

    // 📡 درخواست به OpenAI
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Mmdrza Ultra Advisor, an expert AI education assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.8,
      }),
    });

    const data = await aiRes.json();

    if (!data || !data.choices || !data.choices[0])
      return res.status(500).json({ success: false, error: "پاسخی از هوش مصنوعی دریافت نشد" });

    res.json({
      success: true,
      reply: data.choices[0].message.content,
    });

  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({ success: false, error: "خطا در ارتباط با سرور هوش مصنوعی" });
  }
});

export default router;
