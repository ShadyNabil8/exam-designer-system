const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const database = require("../database");
const {
  getSimulation,
  findOptimumExam,
} = require("../utils/examSimulationUtil");
const {
  postExamValidation,
} = require("../middlewares/examValidationMiddlewares");

const generateExam = [
  postExamValidation,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
  asyncHandler(async (req, res) => {
    const {
      chapters,
      difficultQuestions,
      simpleQuestions,
      remindingQuestions,
      understandingQuestions,
      creativityQuestions,
    } = req.body;

    const numberOfQuestions = 12;

    const optimumExam = await findOptimumExam(
      numberOfQuestions,
      simpleQuestions,
      difficultQuestions,
      remindingQuestions,
      understandingQuestions,
      creativityQuestions,
      chapters
    );

    console.log(optimumExam);

    res.status(201).json({
      message: "TEST",
      data: {
        chapters,
        difficultQuestions,
        simpleQuestions,
        remindingQuestions,
        understandingQuestions,
        creativityQuestions,
      },
    });
  }),
];

module.exports = { generateExam };
