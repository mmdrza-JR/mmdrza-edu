import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 دقیقه
  max: 30, // حداکثر درخواست در دقیقه
  message: {
    success: false,
    error: "⏳ لطفاً کمی صبر کنید و دوباره تلاش کنید.",
  },
});
