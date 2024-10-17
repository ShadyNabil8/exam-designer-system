const countUtil = require("../utils/countUtil");

function calculateFitness(
  individual,
  maxSimple,
  maxDifficult,
  maxReminding,
  maxUnderstanding,
  maxCreativity,
  questionsDistrebution
) {
  let fitness = 0;

  const questions = individual.getDna(0); // Get the selected questions (genes)

  const individualQuestionsDistrebution =
    countUtil.getQuestionsDistribution(questions);
  for (const chapterId in questionsDistrebution) {
    if (individualQuestionsDistrebution.hasOwnProperty(chapterId)) {
      if (
        individualQuestionsDistrebution[chapterId] ===
        questionsDistrebution[chapterId]
      ) {
        fitness += 1;
      }
    }
  }

  const { simple, difficult } = countUtil.countDifficulty(questions);
  if (simple === maxSimple) fitness += 1;
  if (difficult === maxDifficult) fitness += 1;

  const { reminding, understanding, creativity } =
    countUtil.countObjective(questions);
  if (reminding === maxReminding) fitness += 1;
  if (understanding === maxUnderstanding) fitness += 1;
  if (creativity === maxCreativity) fitness += 1;

  return fitness;
}

function shouldFinish(topIndividual, questionsDistrebutionLenth) {
  return topIndividual.fitness === questionsDistrebutionLenth + 5;
}

function mutate(genes, rate, getRandomQuestion) {
  let mutauedChromosomes = genes;

  if (Math.random() < rate) {
    const randomIndex = Math.floor(Math.random() * genes.length);
    mutauedChromosomes = genes.map((gene, i) =>
      i === randomIndex ? getRandomQuestion() : gene
    );
  }
  return mutauedChromosomes;
}

function getSimulationConfig(individual,onCalculateFitness, onFinish) {
  const config = {
    prototype: individual,
    data: {},
    popSize: 100,
    maxGenerations: 50,
    mutationRate: 0.05,
    onCalculateFitness,
    onFinish,
  };

  return config;
}

module.exports = {
  calculateFitness,
  shouldFinish,
  mutate,
  getSimulationConfig,
};
