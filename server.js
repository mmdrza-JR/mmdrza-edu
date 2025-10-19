// ===============================================================
// ⚙️ Mmdrza Ultra Genesis Server v10 — Omega Core Edition
// ===============================================================
// Features:
// ✅ Security Layers (Helmet, RateLimit, XSS Protection)
// ✅ Performance (Compression, Response Time Logging)
// ✅ Session Control + Mongo Connection Events
// ✅ Modular Routes (Auth, AI, Booking)
// ✅ Intelligent Error Handler & Logging
// ===============================================================

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import responseTime from "response-time";
import { fileURLToPath } from "url";

// === Import Routes ===
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

// === Path setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Initialize App ===
const app = express();

// ===============================================================
// 🧩 Middleware Stack
// ===============================================================

// 🧠 CORS Config (only trusted origins)
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://mmdrza.genesis.app"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("🚫 Origin Not Allowed by CORS"));
  },
  credentials: true,
}));

// 🧱 Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(mongoSanitize());
app.use(xssClean());
app.disable("x-powered-by");

// 💨 Performance Middlewares
app.use(compression());
app.use(responseTime((req, res, time) => {
  if (time > 500)
    console.warn(`⚠️ Slow Response: ${req.method} ${req.originalUrl} (${Math.round(time)}ms)`);
}));

// 📋 Body Parser
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

// 🕵️ Rate Limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: { success: false, error: "⏳ درخواست بیش از حد مجاز است، کمی صبر کنید." },
});
app.use("/api", limiter);

// 🧩 Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || "mmdrzaUltraSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ⚠️ اگر SSL داری بذار true
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 ساعت
  },
}));

// 📜 Logger
app.use(morgan("dev"));

// ===============================================================
// 🚀 Static File Serving (Frontend)
// ===============================================================
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================================================
// 🧭 Routes
// ===============================================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/booking", bookingRoutes);

// ===============================================================
// ❌ 404 & Error Handling
// ===============================================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "❌ مسیر مورد نظر یافت نشد",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    error: "🚨 خطای داخلی سرور",
    message: err.message,
  });
});

// ===============================================================
// 🔗 MongoDB Connection
// ===============================================================
mongoose.connection.on("connected", () => console.log("✅ MongoDB Connected Successfully"));
mongoose.connection.on("reconnected", () => console.log("♻️ MongoDB Reconnected"));
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB Disconnected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB Error:", err));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error("❌ MongoDB Initial Connection Failed:", err.message);
  }
})();

// ===============================================================
// 🧠 Server Launch
// ===============================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("===========================================");
  console.log(`🚀 Mmdrza Genesis Core running at: http://localhost:${PORT}`);
  console.log("🧠 Environment:", process.env.NODE_ENV || "development");
  console.log("🛡️ Security: Helmet + XSS + RateLimit + CORS Active");
  console.log("===========================================");
});
