const { body, param, query, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const database = require("../database");

const postQuestionValidation = [
  body("chapterId", "Invalid chapter ID").isMongoId(),
  body("text").isLength({ min: 1 }).withMessage("Question text is required!"),
  body("choices")
    .isArray()
    .withMessage("Choices must be an array with at least 3 items.")
    .custom((value) => {
      if (value.length !== 3) {
        throw new Error("Choices must contain exactly 3 items.");
      }
      return true;
    }),
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
  asyncHandler(async (req, res, next) => {
    const { chapterId } = req.body;

    const [chapter, questionCount] = await Promise.all([
      database.getChapter(chapterId),
      // Ensure that this chapter hasn't reached the limit of the allowed number of questions.
      database.getNumberOfQuestion(chapterId),
    ]);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found!" });
    }

    if (questionCount >= chapter.maxNumberOfQuestions) {
      return res.status(400).json({
        message: "This chapter reached the limit for the number of questions",
      });
    }

    req.chapter = chapter;

    next();
  }),
  asyncHandler(async (req, res, next) => {
    const { chapterId, difficulty, objective } = req.body;
    const chapter = req.chapter;

    const [questionDifficultyDistribution, questionObjectiveDistribution] =
      await Promise.all([
        database.getQuestionDifficultyDistribution(chapterId),
        database.getQuestionObjectiveDistribution(chapterId),
      ]);

    if (
      questionObjectiveDistribution[objective] >=
      chapter.maxNumberOfEachObjective
    ) {
      return res.status(400).json({
        message:
          "Failed adding a question with this objective because there will be no balance",
      });
    }

    if (
      questionDifficultyDistribution[difficulty] >=
      chapter.maxNumberOfEachDifficulty
    ) {
      return res.status(400).json({
        message:
          "Failed adding a question with this difficulty because there will be no balance",
      });
    }

    next();
  }),
];

const getQuestionValidation = [
  param("id", "Invalid question ID").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];

const putQuestionValidation = [
  param("id", "Invalid question ID").isMongoId(),
  body("chapterId", "Invalid chapter ID").isMongoId(),
  body("text").isLength({ min: 1 }).withMessage("Question text is required!"),
  body("choices")
    .custom((value) => {
      if (value.length !== 3) {
        throw new Error("Choices must contain exactly 3 items.");
      }
      return true;
    })
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
];

const deleteQuestionValidation = [
  param("id", "Invalid question ID").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];
module.exports = {
  postQuestionValidation,
  putQuestionValidation,
  getQuestionValidation,
  deleteQuestionValidation,
};
