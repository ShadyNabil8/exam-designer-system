const { body, param, query, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const database = require("../database");

const addCourseValidation = [
  body("name")
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage("Course name is required!"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

const getCourseValidation = [
  param("id", "Invalid course ID").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

const getCourseChaptersValidation = [
  param("id", "Invalid course ID").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

const deleteCourseValidation = [
  param("id", "Invalid course ID").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

const updateCourseValidation = [
  param("id", "Invalid course ID").isMongoId(),
  body("name")
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage("Course name is required!"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

module.exports = {
  addCourseValidation,
  getCourseValidation,
  getCourseChaptersValidation,
  deleteCourseValidation,
  updateCourseValidation
};
