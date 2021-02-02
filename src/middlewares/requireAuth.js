const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Import Model
const User = require("../models/user");
// Export
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message:
        "You are not authenticated! Please sign in to continue.",
    });
  }
  const rawToken = authorization.split(" ");
  const token = rawToken[1];
  jwt.verify(
    token,
    String(process.env.SECRET_KEY),
    async (error, payload) => {
      if (error) {
        console.log("requireAuth cannot verify token");
        return res.status(401).json({
          message: "[requireAuth.js] *error: " + error,
        });
      }
      const { user } = payload;
      try {
        const userResult = await User.findById(user);
        req.user = userResult;
        next();
      } catch (err) {
        console.log(err);
      }
    }
  );
};
