import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  studyLevel: String,
  facultyInterest: String,
  goalText: String,
  preferredDates: [String],
  aiSummary: String,
  aiRecommendation: String,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
