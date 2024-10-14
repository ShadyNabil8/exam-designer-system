const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: true,
    validate: [arrayLimit, "{PATH} must have 3 choices"],
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["simple", "difficult"],
    required: true,
  },
  objective: {
    type: String,
    enum: ["reminding", "understanding", "creativity"],
    required: true,
  },
});

// Custom validation function to ensure exactly 3 choices
function arrayLimit(val) {
  return val.length === 3;
}

module.exports = mongoose.model("Question", questionSchema);
