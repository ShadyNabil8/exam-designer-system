const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");
const {
  addCourseValidation,
  getCourseValidation,
  getCourseChaptersValidation,
  deleteCourseValidation,
  updateCourseValidation,
} = require("../middlewares/courseValidationMiddlewares");

const addCourse = [
  addCourseValidation,
  asyncHandler(async (req, res) => {
    const { name, numberOfChapters } = req.body;

    const addedCourse = await database.addCourse(name, numberOfChapters);

    res.status(200).json({
      message: "The course was successfully added.",
      data: addedCourse,
    });
  }),
];

const getCourses = asyncHandler(async (req, res) => {
  const courses = await database.getCourses();

  res.status(200).json({ data: courses });
});

const getCourse = [
  getCourseValidation,
  asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    const course = await database.getCourse(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "The course was successfully fetched.", data: course });
  }),
];

const getCourseChapters = [
  getCourseChaptersValidation,
  asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    const chapters = await database.getChaptersByCourse(courseId);

    res.status(200).json({
      message: "Course chapters was successfully fetched.",
      data: chapters,
    });
  }),
];

const deleteCourse = [
  deleteCourseValidation,
  asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    const course = await database.deleteCourse(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "The course was successfully deleted.", data: course });
  }),
];

const updateCourse = [
  updateCourseValidation,
  asyncHandler(async (req, res) => {

    const courseId = req.params.id;

    const updatedCourse = await database.updateCourse(courseId, req.body);

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", data: updatedCourse });
  }),
];

module.exports = {
  addCourse,
  getCourses,
  getCourse,
  getCourseChapters,
  deleteCourse,
  updateCourse,
};
