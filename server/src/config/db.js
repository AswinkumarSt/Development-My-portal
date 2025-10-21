const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    console.log("🔗 Attempting MongoDB connection...");
    
    // Increase timeout and add better options for production
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
    });
    
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    console.log("🔍 Connection URI:", MONGODB_URI ? "Set" : "Not set");
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 MongoDB disconnected");
});

module.exports = connectDB;