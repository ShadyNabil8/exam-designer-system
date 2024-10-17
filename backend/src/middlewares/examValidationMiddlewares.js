const {
  body,
  checkExact,
} = require("express-validator");

const postExamValidation = checkExact([
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
]);

module.exports = { postExamValidation };
