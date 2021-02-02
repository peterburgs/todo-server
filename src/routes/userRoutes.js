const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware
const requireAuth = require("../middlewares/requireAuth");

// User must be authenticated before accessing

// Model
const User = require("../models/user");

// POST Method: create new user account
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  //Validate request data
  const user = new User({
    email,
    password,
  });
  const token = jwt.sign(
    { user: user._id },
    String(process.env.SECRET_KEY),
    {
      // Expiration Time
      expiresIn: "8h",
    }
  );
  const userResult = await user.save();
  if (userResult !== null) {
    res.status(201).json({
      message: "Create user successfully",
      user,
      token,
    });
  } else {
    res.status(500).json({ message: "Fail" });
  }
});

// POST Method: signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: "Email or Password is incorrect!!!",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      error: "Email not found!!!",
    });
  }

  // Compare registered email and providing email
  try {
    const signinResult = await user.comparePassword(password);

    const token = jwt.sign(
      { user: user._id },
      String(process.env.SECRET_KEY),
      {
        // Expiration Time
        expiresIn: "8h",
      }
    );
    res.status(200).json({
      user: user,
      message: "Success",
      token,
      expiresIn: 8,
    });
  } catch (err) {
    console.log("[authRoutes.js] *err: ", err);
    return res.status(422).json({
      error: "Invalid email or password",
    });
  }
});

//GET Method: Get a user
router.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({ _id: userId });
  if (user) {
    res.status(200).json({
      message: "Found successfully",
      user,
    });
  } else {
    res.status(404).json({
      message: "User not found!!!",
    });
  }
});

module.exports = router;
