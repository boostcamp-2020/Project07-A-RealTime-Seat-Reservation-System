import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  username: String,
  seats: Array,
  isAvailable: Boolean,
});

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
