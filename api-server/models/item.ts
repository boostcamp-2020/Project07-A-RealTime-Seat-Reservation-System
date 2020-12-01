import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  img: String,
  place: { type: mongoose.SchemaTypes.ObjectId, ref: "Place" },
  prices: Array,
  minBookingCount: Number,
  maxBookingCount: Number,
});

const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
