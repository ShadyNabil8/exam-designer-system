const mongoose = require("mongoose");
const chapterModel = require("./chapterModel");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfChapters: {
    type: Number,
    default: 0,
  },
});

// Query middleware for findOneAndDelete (e.g., courseModel.findOneAndDelete)
courseSchema.pre("findOneAndDelete", async function (next) {
  try {
    const courseId = this.getQuery()._id;

    const chapters = await mongoose.model("Chapter").find({ courseId }).lean();

    if (chapters.length > 0) {
      // Collect all chapter IDs
      const chapterIds = chapters.map((chapter) => chapter._id);

      // Execute all deletions in parallel: delete chapters and associated questions
      await Promise.all([
        mongoose.model("Chapter").deleteMany({ courseId }),
        mongoose
          .model("Question")
          .deleteMany({ chapterId: { $in: chapterIds } }),
      ]);
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Course", courseSchema);
