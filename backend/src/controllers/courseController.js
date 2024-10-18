const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");

const addCourse = [
  body("name")
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage("Course name is required!"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

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
  param("id", "Invalid course ID").isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

const deleteCourse = [
  param("id", "Invalid course ID").isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  param("id", "Invalid course ID").isMongoId(),
  body("name")
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage("Course name is required!"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  deleteCourse,
  updateCourse,
};
