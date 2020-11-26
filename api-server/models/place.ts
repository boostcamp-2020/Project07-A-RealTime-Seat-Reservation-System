import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  name: String,
  point: Object,
  status: String,
  color: String,
});

const seatGroupSchema = new mongoose.Schema({
  class: String,
  seats: [seatSchema],
});

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  seatGroup: [seatGroupSchema],
});

const placeModel = mongoose.model("Place", placeSchema);

export default placeModel;
