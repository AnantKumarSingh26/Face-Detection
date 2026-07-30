const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Check if the URI actually exists before trying to connect
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;