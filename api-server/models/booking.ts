import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  item: Object,
  schedule: Object,
  seats: Array,
  isAvailable: Boolean,
});

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
