const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { auth, adminAuth } = require("../middleware/auth");

// 🛡️ ADMIN ONLY ROUTES
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, adminAuth, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phone,
      district, // Add district
      state, // Add state
      address 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "user",
      phone,
      district, // Include district at root level
      state, // Include state at root level
      address: {
        ...address,
        district: district || address?.district, // Ensure district in address
        state: state || address?.state // Ensure state in address
      }
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        district: user.district, // Include district in response
        state: user.state, // Include state in response
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      role, 
      phone,
      district, // Add district
      state, // Add state
      address 
    } = req.body;

    const updates = { 
      name, 
      email, 
      role, 
      phone,
      district, // Include district
      state, // Include state
      address: {
        ...address,
        district: district || address?.district,
        state: state || address?.state
      }
    };

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔐 USER PROFILE ROUTES (for regular users)
router.get("/profile/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

router.put("/profile/me", auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      "name", 
      "email", 
      "phone",
      "district", // Add district
      "state", // Add state
      "address"
    ];
    
    const isValidOperation = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    // Users can only update their own profile
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;