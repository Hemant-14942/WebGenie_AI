import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  credits: { type: Number, default: 100, min: 0 },
  plans: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
 
}, {
  timestamps: true,
});

export const User = mongoose.model("User", userSchema);