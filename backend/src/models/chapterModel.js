const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  maxNumberOfQuestions: {
    type: Number,
    required: true,
  },
});

// Virtual to alias courseId as course when populated
chapterSchema.virtual("course", {
  ref: "Course",
  localField: "courseId",
  foreignField: "_id",
  justOne: true, // Since courseId is an ObjectId, just populate one document
});

// Enable virtuals in toJSON and toObject
chapterSchema.set("toObject", { virtuals: true });
chapterSchema.set("toJSON", { virtuals: true });

chapterSchema.pre("save", async function (next) {
  try {
    // I used mongoose.model() to reference the Course model dynamically to solve circular dependency
    const courseModel = mongoose.model("Course");
    await courseModel.findByIdAndUpdate(this.courseId, {
      $inc: { numberOfChapters: 1 }, // NOTE: $inc operator is atomic
    });
    next();
  } catch (error) {
    next(error);
  }
});

chapterSchema.pre("findOneAndDelete", async function (next) {
  try {
    const chapter = await this.model.findOne(this.getQuery());
    if (chapter) {
      const courseModel = mongoose.model("Course");
      await courseModel.findByIdAndUpdate(chapter.courseId, {
        $inc: { numberOfChapters: -1 },
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Chapter", chapterSchema);
