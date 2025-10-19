import express from "express";
import { registerUser, verifyCode } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyCode);

export default router;
