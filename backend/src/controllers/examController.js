const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const database = require("../database");
const { findOptimumExam } = require("../utils/examSimulationUtil");
const {
  postExamValidation,
} = require("../middlewares/examValidationMiddlewares");
const questionPool = require("../dummyData/questions");
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
    const { chapters, difficulty, objective } = req.body;

    const numberOfQuestions = Object.values(chapters).reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      },
      0
    );
    console.log(numberOfQuestions);
    console.log(chapters);
    
    const optimumExam = await findOptimumExam(
      questionPool,
      numberOfQuestions,
      difficulty,
      objective,
      chapters
    );

    res.status(201).json({
      message: "TEST",
      data: optimumExam,
    });
  }),
];

module.exports = { generateExam };
