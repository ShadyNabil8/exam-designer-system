const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const database = require("../database");

const addCourse = [
  body("name")
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage("Course name is required!"),
  body("numberOfChapters")
    .isInt({ min: 1 }) // Ensure it's a positive integer
    .withMessage(
      "Number of Chapters is required and must be a valid positive integer!"
    )
    .toInt(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { name, numberOfChapters } = req.body;

    const addedCourse = await database.addCourse(name, numberOfChapters);

    res
      .status(200)
      .json({
        message: "The course was successfully added.",
        addedCourse: addedCourse,
      });
  }),
];

module.exports = { addCourse };
