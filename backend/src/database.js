const mongoose = require("mongoose");
const courseModel = require("./models/courseModel");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

async function addCourse(name, numberOfChapters) {
  const addedCourse = await courseModel.create({
    name,
    numberOfChapters,
  });
  return addedCourse;
}

async function getCourses() {
  const courses = await courseModel.find({});
  return courses;
}

async function getCourse(id) {
  const course = await courseModel.findById(id);
  return course;
}

async function deleteCourse(id) {
  const course = await courseModel.findByIdAndDelete(id);
  return course;
}

async function updateCourse(id, updatedData) {
  const updatedCourse = await courseModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: false,
  });
  return updatedCourse;
}

module.exports = {
  dbConnect,
  addCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
};
