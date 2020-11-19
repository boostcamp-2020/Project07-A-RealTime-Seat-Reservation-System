import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  name: String,
});

const testModel = mongoose.model("Test", testSchema);

export default testModel;
