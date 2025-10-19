import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";

const generateCode = () => crypto.randomInt(100000, 999999);
const expiry = () => new Date(Date.now() + 5 * 60 * 1000);

export const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, error: "نام و ایمیل الزامی است" });

    const code = generateCode();
    const expiresAt = expiry();
    let user = await User.findOne({ email });

    if (user) Object.assign(user, { verifyCode: code, codeExpiresAt: expiresAt, isVerified: false });
    else user = new User({ name, email, verifyCode: code, codeExpiresAt: expiresAt });

    await user.save();
    await sendVerificationEmail(email, code);
    res.json({ success: true, message: "کد تأیید ارسال شد ✉️", expiresAt });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "خطای سرور در ثبت‌نام" });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: "کاربر یافت نشد" });
    if (new Date() > user.codeExpiresAt) return res.status(400).json({ success: false, error: "⏰ کد منقضی شده" });
    if (String(user.verifyCode) !== String(code)) return res.status(400).json({ success: false, error: "کد اشتباه است" });

    user.isVerified = true;
    user.verifyCode = null;
    await user.save();
    req.session.user = { name: user.name, email: user.email };
    res.json({ success: true, message: "ورود موفق ✅", user: req.session.user });
  } catch {
    res.status(500).json({ success: false, error: "خطا در تأیید کد" });
  }
};

