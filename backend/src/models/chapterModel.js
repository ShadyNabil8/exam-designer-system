const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const questionModel = require("./questionModel");

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

chapterSchema.plugin(mongooseLeanVirtuals);

// Virtual to alias courseId as course when populated
chapterSchema.virtual("course", {
  ref: "Course",
  localField: "courseId",
  foreignField: "_id",
  justOne: true, // Since courseId is an ObjectId, just populate one document
});

// Virtual for the maximum number of the question that has a uniqe difficulty.
chapterSchema.virtual("maxNumberOfEachDifficulty").get(function () {
  const difficultyEnum = Object.values(
    questionModel.schema.path("difficulty")
  )[0];
  return Math.floor(this.maxNumberOfQuestions / difficultyEnum.length);
});

// Virtual for the maximum number of the question that has a uniqe objective.
chapterSchema.virtual("maxNumberOfEachObjective").get(function () {
  const objectiveEnum = Object.values(
    questionModel.schema.path("objective")
  )[0];
  return Math.floor(this.maxNumberOfQuestions / objectiveEnum.length);
});

// Ensure that virtual fields are included when the document is converted to JSON or a plain object (as it will be in API responses).
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
    const chapter = await this.model.findOne(this.getQuery()).lean();

    if (!chapter) {
      return next();
    }

    // I used mongoose.model() to reference the Course model dynamically to solve circular dependency
    const courseModel = mongoose.model("Course");

    // Execute the operations in parallel: update the course and delete the questions
    await Promise.all([
      courseModel.findByIdAndUpdate(chapter.courseId, {
        $inc: { numberOfChapters: -1 },
      }),
      questionModel.deleteMany({ chapterId: chapter._id }), // Delete questions for the chapter
    ]);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Chapter", chapterSchema);
