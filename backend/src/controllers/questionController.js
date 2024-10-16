const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");

const addQuestion = [
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
  asyncHandler(async (req, res) => {
    const { chapterId, text, choices, correctAnswer, difficulty, objective } =
      req.body;

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

    [questionDifficultyDistribution, questionObkectiveDistribution] =
      await Promise.all([
        database.getQuestionDifficultyDistribution(chapterId),
        database.getQuestionObjectiveDistribution(chapterId),
      ]);

    if (
      questionObkectiveDistribution[objective] >=
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
          "Failed adding a question with this difficuly because there will be no balance",
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

const getQuestions = asyncHandler(async (req, res) => {
  const questions = await database.getQuestions();

  res.status(200).json({ data: questions });
});

const getQuestion = [
  param("id", "Invalid question ID").isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  param("id", "Invalid question ID").isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
