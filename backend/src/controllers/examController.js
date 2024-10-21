const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const database = require("../database");
const { findOptimumExam } = require("../utils/examSimulationUtil");
const {
  postExamValidation,
  addExamValidation,
  findExamValidation,
  findExamQuestionsValidation,
} = require("../middlewares/examValidationMiddlewares");
const generateExam = [
  postExamValidation,
  asyncHandler(async (req, res) => {
    const { chapters, difficulty, objective } = req.body;

    const numberOfQuestions = Object.values(chapters).reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      },
      0
    );

    const chapterIds = Object.keys(chapters);
    const questionPool = await database.getQuestionsByChapterIds(chapterIds);

    if (questionPool.length === 0) {
      return res
        .status(400)
        .json({ message: "There is no any question to make an exam!" });
    }

    const optimumExam = await findOptimumExam(
      questionPool,
      numberOfQuestions,
      difficulty,
      objective,
      chapters
    );

    res.status(201).json({
      message: "Exam successfully found",
      data: optimumExam,
    });
  }),
];

const addExam = [
  addExamValidation,
  asyncHandler(async (req, res) => {
    const {
      courseId,
      questions,
      difficultyDistribution,
      objectiveDistribution,
    } = req.body;
    const addedExam = await database.addExam(
      courseId,
      questions,
      difficultyDistribution,
      objectiveDistribution
    );

    return res
      .status(200)
      .json({ message: "Exam is added successfully", data: addedExam });
  }),
];

const findExam = [
  findExamValidation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const exam = await database.findExamById(id);

    return res.status(200).json({ message: "Exam found", data: exam });
  }),
];

const findExams = [
  asyncHandler(async (req, res) => {
    const exams = await database.findExams();
    return res.status(200).json({ message: "Exams found", data: exams });
  }),
];

const findExamQuestions = [
  findExamQuestionsValidation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const questions = await database.findExamQuestions(id);

    return res
      .status(200)
      .json({ message: "Exam questions found", data: questions });
  }),
];

module.exports = {
  generateExam,
  addExam,
  findExam,
  findExamQuestions,
  findExams,
};
