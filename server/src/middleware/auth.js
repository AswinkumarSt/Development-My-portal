const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Token is invalid." });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is invalid." });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    // First run regular auth
    await auth(req, res, () => {});

    // Then check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin role required.",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed." });
  }
};

module.exports = { auth, adminAuth };
