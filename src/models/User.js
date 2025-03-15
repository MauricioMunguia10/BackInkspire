import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  user: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  second_email: String,
  type_user: String,
  active: String,
});

const User = mongoose.model("User", userSchema);

export default User;
