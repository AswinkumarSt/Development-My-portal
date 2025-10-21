const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { auth } = require("../middleware/auth");

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Login successful
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "user",
    });

    await user.save();

    // Generate token for immediate login
    const token = user.generateAuthToken();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    res.status(400).json({
      error: error.message,
    });
  }
});

// Get current user profile (protected route)
router.get("/me", auth, async (req, res) => {
  res.json({
    user: req.user,
  });
});

// Create first admin user (one-time setup)
router.post("/setup-admin", async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        error: "Admin user already exists",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await adminUser.save();

    // Generate token
    const token = adminUser.generateAuthToken();

    res.status(201).json({
      message: "Admin user created successfully",
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    res.status(400).json({ error: error.message });
  }
});

// Logout user (optional - client-side token removal)
router.post("/logout", auth, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, just return success - client will remove token
    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
