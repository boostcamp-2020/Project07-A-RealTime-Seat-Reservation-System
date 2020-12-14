import mongoose from "mongoose";

const slotSeatSchema = new mongoose.Schema({
  name: String,
  point: Object,
  status: String,
  color: String,
  class: String,
});

const scheduleSchema = new mongoose.Schema({
  itemId: mongoose.Schema.Types.ObjectId,
  date: Date,
  seatInfo: [
    {
      class: String,
      count: Number,
      color: String,
    },
  ],
  seats: [slotSeatSchema],
});

const scheduleModel = mongoose.model("Schedule", scheduleSchema);

export default scheduleModel;
