import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  date: Date,
  minBookingCount: Number,
  maxBookingCount: Number,
  isSaleDay: Boolean,
});

const scheduleModel = mongoose.model("Schedule", scheduleSchema);

export default scheduleModel;
