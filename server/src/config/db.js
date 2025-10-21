const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/My-portal";

console.log("🔗 Attempting MongoDB connection...");
console.log("📡 MONGODB_URI:", MONGODB_URI ? "Set" : "Not set");

// Connect to MongoDB (remove deprecated options)
mongoose.connect(MONGODB_URI);

// Connection events
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 MongoDB disconnected");
});

module.exports = mongoose;