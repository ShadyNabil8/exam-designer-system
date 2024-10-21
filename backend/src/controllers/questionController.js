const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");
const {
  postQuestionValidation,
  putQuestionValidation,
  getQuestionValidation,
  deleteQuestionValidation,
} = require("../middlewares/questionValidationMiddlewares");

const addQuestion = [
  postQuestionValidation,
  asyncHandler(async (req, res) => {
    const { chapterId, text, choices, correctAnswer, difficulty, objective } =
      req.body;

    const newQuestion = await database.addQuestion(
      chapterId,
      text,
      choices,
      correctAnswer,
      difficulty,
      objective
    );

    res.status(201).json({
      message: "Question added successfully.",
      data: newQuestion,
    });
  }),
];

const getQuestions = asyncHandler(async (req, res) => {
  const questions = await database.getQuestions();

  res.status(200).json({ data: questions });
});

const getQuestion = [
  getQuestionValidation,
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;

    const question = await database.getQuestion(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      message: "The question was successfully fetched.",
      data: question,
    });
  }),
];

const deleteQuestion = [
  deleteQuestionValidation,
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;

    const deletedQuestion = await database.deleteQuestion(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      message: "The question was successfully deleted.",
      data: deletedQuestion,
    });
  }),
];

const updateQuestion = [
  putQuestionValidation,
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;

    const { chapterId, text, choices, correctAnswer, difficulty, objective } =
      req.body;

    // I prefere to use many args rather than just use req.body to make things clear and to know that actually database function needs.
    const updatedQuestion = await database.updateQuestion(
      questionId,
      chapterId,
      text,
      choices,
      correctAnswer,
      difficulty,
      objective
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res
      .status(200)
      .json({ message: "Chapter updated successfully", data: updatedQuestion });
  }),
];
module.exports = {
  addQuestion,
  getQuestions,
  getQuestion,
  deleteQuestion,
  updateQuestion,
};
