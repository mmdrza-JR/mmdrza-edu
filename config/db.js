import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    logger.success("✅ MongoDB Connected Successfully");

    mongoose.connection.on("disconnected", () => logger.warn("⚠️ MongoDB Disconnected"));
    mongoose.connection.on("reconnected", () => logger.info("♻️ MongoDB Reconnected"));
    mongoose.connection.on("error", (err) => logger.error(`❌ MongoDB Error: ${err.message}`));

  } catch (err) {
    logger.error(`❌ MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  }
};
