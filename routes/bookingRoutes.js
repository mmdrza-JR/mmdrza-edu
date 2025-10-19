// ============================================================
// 📅 Booking Routes — Mmdrza Ultra Genesis v3.0
// ============================================================
import express from "express";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// ✅ ایجاد جلسه مشاوره جدید
router.post("/create", createBooking);

export default router;
