const { body, checkExact, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const database = require("../database");

const postExamValidation = [
  checkExact([
    body("chapters")
      .isObject()
      .withMessage("No chapters provided")
      .custom((chapters) => {
        const numOfQuestions = Object.values(chapters);
        if (numOfQuestions.length === 0) {
          throw new Error("You must provide at least one chapter.");
        }
        for (let n in chapters) {
          const chapterQuestions = Number(chapters[n]);
          if (isNaN(chapterQuestions) || chapterQuestions < 1) {
            throw new Error(
              `The number of questions for chapters must be a valid number and greater than or equal to 1.`
            );
          }
          chapters[n] = chapterQuestions;
        }
        return true;
      }),
    body("difficulty")
      .isObject()
      .custom((difficulty) => {
        for (let key in difficulty) {
          const difficultyNumOfQuestion = Number(difficulty[key]);
          if (isNaN(difficultyNumOfQuestion) || difficultyNumOfQuestion < 0) {
            throw new Error(
              "The number of questions for difficulty must be a valid number"
            );
          }
          difficulty[key] = difficultyNumOfQuestion;
        }
        return true;
      }),
    body("objective")
      .isObject()
      .custom((objective) => {
        for (let key in objective) {
          const objectiveNumOfQuestion = Number(objective[key]);
          if (isNaN(objectiveNumOfQuestion) || objectiveNumOfQuestion < 0) {
            throw new Error("The number of objective  must be a valid number");
          }
          objective[key] = objectiveNumOfQuestion;
        }
        return true;
      }),
  ]),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

const addExamValidation = [
  body("courseId").isMongoId().withMessage("Invalid course"),
  body("questionsIds")
    .isArray({ min: 1 })
    .withMessage("Questions must be non-empty.")
    .custom((questionsIds) => {
      for (let questionId of questionsIds) {
        if (!mongoose.Types.ObjectId.isValid(questionId)) {
          throw new Error("Question must be valid questions.");
        }
      }
      return true;
    }),
  body("difficultyDistribution")
    .isObject()
    .withMessage("Difficulty distribution must be an object.")
    .custom((distribution) => {
      const difficulties = Object.keys(distribution);
      if (difficulties.length === 0) {
        throw new Error("Difficulties are required");
      }
      for (let difficulty of difficulties) {
        if (!["simple", "difficult"].includes(difficulty)) {
          throw new Error(
            "Difficulties are required and must be one of simple, ane difficult"
          );
        }
        const difficultyCount = Number(distribution[difficulty]);
        if (isNaN(difficultyCount) || difficultyCount < 0) {
          throw new Error("Difficulty count must be a positive number");
        }
        distribution[difficulty] = difficultyCount;
      }
      return true;
    }),
  body("objectiveDistribution")
    .isObject()
    .withMessage("Objective distribution must be an object.")
    .custom((distribution) => {
      const objectives = Object.keys(distribution);
      if (objectives.length === 0) {
        throw new Error("Objectives are required");
      }
      for (let objective of objectives) {
        if (!["reminding", "understanding", "creativity"].includes(objective)) {
          throw new Error(
            "Objectives are required and must be one of simple, ane difficult"
          );
        }
        const objectiveCount = Number(distribution[objective]);
        if (isNaN(objectiveCount) || objectiveCount < 0) {
          throw new Error("Objective count must be a positive number");
        }
        distribution[objective] = objectiveCount;
      }
      return true;
    }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
  asyncHandler(async (req, res, next) => {
    const isCourseExist = await database.isCourseExistsById(req.body.courseId);
    if (!isCourseExist) {
      return res.status(404).json({ message: "Course doesn't exist" });
    }
    next();
  }),
];

module.exports = { postExamValidation, addExamValidation };
