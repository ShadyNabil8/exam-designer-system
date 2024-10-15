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

module.exports = mongoose.model("Chapter", chapterSchema);
