const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    default: " ",
  },
  description: { type: String },
  icon: { type: String },
  isCompleted: { type: Boolean, default: 0 }, //1: completed
});

module.exports = mongoose.model("Task", taskSchema);
