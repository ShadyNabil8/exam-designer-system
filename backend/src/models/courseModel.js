const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfChapters: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
