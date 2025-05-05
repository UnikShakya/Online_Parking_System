const jwt = require('jsonwebtoken');
const User = require("./User/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(" ")[1]; // Fallback for Bearer token
  console.log("Received Token:", token);

  if (!token) {
    console.log("No token found in headers.");
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found with ID from token:", decoded.id);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    console.log("Authenticated user:", user.email || user.username || user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ success: false, message: 'Invalid Token. Please log in again.' });
  }
};

module.exports = authMiddleware;
