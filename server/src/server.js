const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

// DEBUG: Check if .env is loading
console.log("🚀 Server starting...");
console.log("📁 Current directory:", process.cwd());
console.log("🔑 JWT_SECRET from .env:", process.env.JWT_SECRET);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("📡 PORT:", process.env.PORT);
console.log("🗄️ MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");

const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DEBUG: Add a test route
app.get("/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({
    message: "Server is working!",
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Not set",
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));

// Protected route example
app.use(
  "/api/users",
  require("./middleware/auth").auth,
  require("./routes/users")
);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Start server
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`✅ Server running on: http://localhost:${PORT}`);
  });
});
