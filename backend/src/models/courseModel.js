const mongoose = require("mongoose");
const chapterModel = require("./chapterModel");

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

// Query middleware for findOneAndDelete (e.g., courseModel.findOneAndDelete)
courseSchema.pre("findOneAndDelete", async function (next) {
  try {
    const courseId = this.getQuery()._id; // Get the course ID from the query

    await chapterModel.deleteMany({ courseId });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Course", courseSchema);
