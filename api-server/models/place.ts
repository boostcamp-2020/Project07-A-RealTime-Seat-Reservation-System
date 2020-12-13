import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  name: String,
  point: Object,
  status: String,
  color: String,
  class: String,
});

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  seatInfo: [
    {
      class: String,
      count: Number,
      color: String,
    },
  ],
  seats: [seatSchema],
});

const placeModel = mongoose.model("Place", placeSchema);

export default placeModel;
