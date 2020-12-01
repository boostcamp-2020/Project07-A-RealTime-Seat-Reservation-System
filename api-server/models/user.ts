import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
