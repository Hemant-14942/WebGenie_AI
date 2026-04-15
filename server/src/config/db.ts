import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to MongoDB");
   
  }
};
