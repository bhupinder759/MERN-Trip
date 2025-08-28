import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      // Optional configs (can be removed if not needed in Mongoose 7+)
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", (error as Error).message);
    process.exit(1); // Stop the server if DB fails
  }
};