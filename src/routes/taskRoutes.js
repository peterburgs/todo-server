const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware
const requireAuth = require("../middlewares/requireAuth");

// User must be authenticated before accessing
router.use(requireAuth);

// Model
const Task = require("../models/task");
const User = require("../models/user");

// POST Method: create a new task
router.post("/", async (req, res) => {
  const {
    title,
    description,
    icon,
    isTodo,
    isRemoved,
    user,
  } = req.body;

  const task = new Task({
    title,
    description,
    icon,
    isTodo,
    isRemoved,
    user,
  });
  try {
    const taskResult = await task.save();
    res.status(200).json({
      message: "Save successfully",
      task,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Cannot save",
      error: err.message,
    });
  }
});

// GET Method: get all Todo tasks
router.get("/todo", async (req, res) => {
  const { user } = req.body;
  try {
    const userTodo = await Task.find({
      user,
      isRemoved: false,
      isTodo: true,
    });
    if (userTodo) {
      res.status(200).json({
        message: "Todo task found successfully",
        tasks: userTodo,
      });
    } else {
      res.status(500).json({
        message: "Cannot get todo task",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Cannot get todo task",
    });
  }
});

// GET Method: get all Completed tasks
router.get("/completed", async (req, res) => {
  const { user } = req.body;
  try {
    const userCompleted = await Task.find({
      user,
      isRemoved: false,
      isTodo: false,
    });
    if (userCompleted) {
      res.status(200).json({
        message: "Completed task found successfully",
        tasks: userCompleted,
      });
    } else {
      res.status(500).json({
        message: "Cannot get Completed task",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Cannot get Completed task",
    });
  }
});

//GET Method: get a task
router.get("/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const taskResult = await Task.findOne({
      _id: taskId,
      isRemoved: false,
    });
    if (taskResult) {
      res.status(200).json({
        message: "Task found successfully",
        task: taskResult,
      });
    } else {
      res.status(404).json({
        message: "Task not found!!!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Task not found!!!",
    });
  }
});

//PUT Method: edit task
router.put("/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const {
    title,
    description,
    icon,
    isTodo,
    isRemoved,
    user,
  } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId },
      { title, description, icon, isTodo, isRemoved, user },
      { new: true }
    );
    if (task) {
      res.status(200).json({
        message: "Edited Successfully",
        task,
      });
    } else {
      res.status(401).json({
        message: "Cannot edit",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Server error!!!",
    });
  }
});
module.exports = router;
