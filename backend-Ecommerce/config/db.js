import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Render ke liye correct

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI // 👈 yahi main fix hai
    );

    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection FAILED:", error);
    process.exit(1);
  }
};

export default connectDB;