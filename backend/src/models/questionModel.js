const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

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

questionSchema.plugin(mongooseLeanVirtuals);

// Custom validation function to ensure exactly 3 choices
function arrayLimit(val) {
  return val.length === 3;
}

// Virtual to alias chapterId as chapter when populated
questionSchema.virtual("chapter", {
  ref: "Chapter",
  localField: "chapterId",
  foreignField: "_id",
  justOne: true, // Since chapterId is an ObjectId, just populate one document
});

// Enable virtuals in toJSON and toObject
questionSchema.set("toObject", { virtuals: true });
questionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Question", questionSchema);
