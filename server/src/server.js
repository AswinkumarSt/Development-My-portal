require('dotenv').config();

console.log("🚀 Server starting in", process.env.NODE_ENV, "mode");

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS configuration that works
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://eloquent-froyo-07dd4f.netlify.app",
    "https://*.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

// Test routes
app.get("/test", (req, res) => {
  res.json({ 
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

app.get("/test-cors", (req, res) => {
  res.json({ 
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
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
      console.log(`🌍 CORS enabled for: localhost:3000, Netlify`);
    });
  } catch (error) {
    console.log("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();