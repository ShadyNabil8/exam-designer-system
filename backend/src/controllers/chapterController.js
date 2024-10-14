const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");

const addChapter = [
  body("name")
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage("Chapter name is required!"),
  body("number")
    .isInt({ min: 1 }) // Ensure it's a positive integer
    .withMessage(
      "Chapter number is required and must be a valid positive integer!"
    )
    .toInt(),
  body("courseId").isMongoId().withMessage("Invalid course ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { name, number, courseId } = req.body;

    const selectedCourse = await database.getCourse(courseId);

    if (!selectedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const addedChapter = await database.addChapter(name, number, courseId);

    res.status(200).json({
      message: "The chapter was successfully added.",
      addedChapter: addedChapter,
    });
  }),
];

const getChapters = asyncHandler(async (req, res) => {
  const chapters = await database.getChapters();

  res.status(200).json({ data: chapters });
});
module.exports = { addChapter, getChapters };
