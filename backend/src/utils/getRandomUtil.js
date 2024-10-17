const { CustomError } = require("../middlewares/errorHandlerMiddleware");

function generateQuestion(questionPool) {
  if (!questionPool || questionPool.length === 0) {
    throw new CustomError("There is no question provided to make an exam", 400);
  }
  const randomIndex = Math.floor(Math.random() * questionPool.length);
  return questionPool[randomIndex];
}

module.exports = {
  generateQuestion,
};
