const {
  body,
  param,
  validationResult,
  checkExact,
} = require("express-validator");

const postExamValidation = checkExact([
  body("chapters")
    .isObject()
    .custom((chapters) => {
      const numOfQuestions = Object.values(chapters);
      if (numOfQuestions.length <= 0) {
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

  // Simple numeric validations for other fields
  body("difficultQuestions")
    .isInt({ min: 0 })
    .toInt()
    .withMessage("Difficult questions must be a positive number"),
  body("simpleQuestions")
    .isInt({ min: 0 })
    .toInt()
    .withMessage("Simple questions must be a positive number"),
  body("remindingQuestions")
    .isInt({ min: 0 })
    .toInt()
    .withMessage("Reminding questions must be a positive number"),
  body("understandingQuestions")
    .isInt({ min: 0 })
    .toInt()
    .withMessage("Understanding questions must be a positive number"),
  body("creativityQuestions")
    .isInt({ min: 0 })
    .toInt()
    .withMessage("Creativity questions must be a positive number"),
]);

module.exports = { postExamValidation };
