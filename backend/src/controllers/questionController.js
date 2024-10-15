const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");

// Max number of question per chapter.
const MAX_NUMBER_OF_QUESTION = 12;

const addQuestion = [
  body("chapterId", "Invalid chapter ID").isMongoId(),
  body("text").isLength({ min: 1 }).withMessage("Question text is required!"),
  body("choices")
    .isArray({ min: 3 })
    .withMessage("Choices must be an array with at least 3 items."),
  body("correctAnswer")
    .isString()
    .withMessage("Correct answer is required!")
    .custom((value, { req }) => {
      const choices = req.body.choices;
      if (!choices || !choices.includes(value)) {
        throw new Error("Correct answer must be one of the provided choices");
      }
      return true;
    }),
  body("difficulty")
    .isIn(["simple", "difficult"])
    .withMessage("Difficulty must be either 'simple' or 'difficult'."),
  body("objective")
    .isIn(["reminding", "understanding", "creativity"])
    .withMessage(
      "Objective must be one of 'reminding', 'understanding', or 'creativity'."
    ),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
  asyncHandler(async (req, res) => {
    const { chapterId, text, choices, correctAnswer, difficulty, objective } =
      req.body;

    const [chapterExists, questionCount] = await Promise.all([
      database.isChapterExistsById(chapterId),
      // Ensure that this chapter hasn't reached the limit of the allowed number of questions.
      database.getNumberOfQuestion(chapterId),
    ]);

    if (!chapterExists) {
      return res.status(404).json({ message: "Chapter not found!" });
    }

    if (questionCount >= MAX_NUMBER_OF_QUESTION) {
      return res.status(400).json({
        message: "This chapter reached the limit for the number of questions",
      });
    }

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

module.exports = {
  addQuestion,
};
