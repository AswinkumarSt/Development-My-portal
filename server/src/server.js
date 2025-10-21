require('dotenv').config();

console.log("🚀 Server starting in", process.env.NODE_ENV, "mode");

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-domain.onrender.com" // Add your frontend URL
  ],
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.json({ 
    message: "Server is working!",
    environment: process.env.NODE_ENV,
    database: "Checking..."
  });
});

// Database test route
app.get("/test-db", async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.json({
      database: states[dbState],
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./middleware/auth").auth, require("./routes/users"));

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.log("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();