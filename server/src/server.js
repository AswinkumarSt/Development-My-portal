require('dotenv').config({ path: require('path').join(__dirname, "../.env") });

console.log("🚀 Server starting...");
console.log("📁 Current directory:", __dirname);
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("📡 PORT:", process.env.PORT);
console.log("🗄️ MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ 
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./middleware/auth").auth, require("./routes/users"));

// Start server immediately, don't wait for MongoDB
console.log("🔄 Starting server...");

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎉 Server successfully started on port ${PORT}!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://127.0.0.1:${PORT}`);
  
  // Now connect to MongoDB
  console.log("🔄 Connecting to MongoDB...");
  const mongoose = require("./config/db");
});

// Handle server errors
server.on('error', (err) => {
  console.log('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is already in use`);
  }
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.log('💥 Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});