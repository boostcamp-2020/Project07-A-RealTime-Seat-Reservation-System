import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({});

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
