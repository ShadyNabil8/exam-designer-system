function countDifficulty(questions) {
  const distributionObj = { simple: 0, difficult: 0 };
  questions.forEach((element) => {
    distributionObj[element.difficulty]++;
  });

  return distributionObj;
}

function countObjective(questions) {
  const distributionObj = { understanding: 0, reminding: 0, creativity: 0 };

  questions.forEach((element) => {
    distributionObj[element.objective]++;
  });

  return distributionObj;
}

function getQuestionsDistribution(questions) {
  const distributionObj = {};

  questions.forEach((element) => {
    if (distributionObj[element.chapterId]) {
      distributionObj[element.chapterId]++;
    } else {
      distributionObj[element.chapterId] = 1;
    }
  });

  return distributionObj;
}

module.exports = {
  countDifficulty,
  countObjective,
  getQuestionsDistribution,
};
