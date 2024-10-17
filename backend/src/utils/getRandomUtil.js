function generateQuestion(questionPool) {
  const randomIndex = Math.floor(Math.random() * questionPool.length);
  return questionPool[randomIndex];
}

module.exports = {
  generateQuestion,
};
