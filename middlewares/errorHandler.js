import { logger } from "../config/logger.js";

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: "❌ مسیر مورد نظر یافت نشد",
    path: req.originalUrl,
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  logger.error(`🔥 ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: "🚨 خطای داخلی سرور",
    message: err.message,
  });
};
