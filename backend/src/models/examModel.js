const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const examSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  questionsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  ],
  difficultyDistribution: {
    simple: { type: Number, required: true },
    difficult: { type: Number, required: true },
  },
  objectiveDistribution: {
    reminding: { type: Number, required: true },
    understanding: { type: Number, required: true },
    creativity: { type: Number, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

examSchema.plugin(mongooseLeanVirtuals);

examSchema.virtual("course", {
  ref: "Course",
  localField: "courseId",
  foreignField: "_id",
  justOne: true, // Since courseId is an ObjectId, just populate one document
});

examSchema.virtual("questions", {
  ref: "Question",
  localField: "questionsIds",
  foreignField: "_id",
});

// Ensure that virtual fields are included when the document is converted to JSON or a plain object (as it will be in API responses).
examSchema.set("toObject", { virtuals: true });
examSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Exam", examSchema);
