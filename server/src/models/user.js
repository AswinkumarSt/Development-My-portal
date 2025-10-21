const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // Add district and state at root level
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    address: {
      houseName: {
        type: String,
        trim: true,
      },
      poNumber: {
        type: String,
        trim: true,
      },
      landmarks: {
        type: String,
        trim: true,
      },
      locality: {
        type: String,
        trim: true,
      },
      town: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.generateAuthToken = function () {
  const jwt = require("jsonwebtoken");
  const secret = process.env.JWT_SECRET || "your-secret-key";

  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    secret,
    { expiresIn: "7d" }
  );
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;