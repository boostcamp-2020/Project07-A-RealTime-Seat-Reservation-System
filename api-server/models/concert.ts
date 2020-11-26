import mongoose from "mongoose";

const concertSchema = new mongoose.Schema({
  name: String,
  startTime: Date,
  endTime: Date,
  img: String,
});

const concertModel = mongoose.model("Concert", concertSchema);

export default concertModel;
