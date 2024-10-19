const { body, param } = require("express-validator");

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
];
module.exports = { postQuestionValidation, putQuestionValidation };
