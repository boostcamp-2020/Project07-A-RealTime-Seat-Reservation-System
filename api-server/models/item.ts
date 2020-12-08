import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  img: String,
  place: { type: mongoose.SchemaTypes.ObjectId, ref: "Place" },
  prices: Array,
  classes: Array,
  minBookingCount: Number,
  maxBookingCount: Number,
  genre: String,
  ageLimit: String,
  runningTime: String,
});

const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
