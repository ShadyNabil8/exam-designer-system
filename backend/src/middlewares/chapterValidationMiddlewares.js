const { body, param, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const database = require("../database");

const chapterUpdateValidation = [
  param("id", "Invalid chapter ID").isMongoId(),
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
  body("maxNumberOfQuestions")
    .isInt({ min: 1 }) // Ensure it's a positive integer
    .withMessage(
      "Maximum number of questions is required and must be a valid positive integer!"
    )
    .toInt(),
  body("courseId").isMongoId().withMessage("Invalid course ID"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
  asyncHandler(async (req, res, next) => {
    const chapterId = req.params.id;
    const { courseId, number } = req.body;

    const chapterExists = await database.isChapterExistsById(chapterId);
    if (!chapterExists) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const chapterExistsWithSameNumber = await database.isChapterExists(
      number,
      courseId,
      chapterId
    );
    if (chapterExistsWithSameNumber) {
      return res
        .status(400)
        .json({ message: "Chapter With the same number exists!" });
    }
    next();
  }),
];

module.exports = { chapterUpdateValidation };
