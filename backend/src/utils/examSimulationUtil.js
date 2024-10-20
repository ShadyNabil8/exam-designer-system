const genie = require("@adrianperea/genie.js");
const { Simulation, Individual, Chromosome } = genie;
const geneticAlgorithmConfig = require("../config/geneticAlgorithmConfig");
const getRandomUtil = require("../utils/getRandomUtil");

function getSimulation(
  questionPool,
  numberOfQuestions,
  difficulty,
  objective,
  questionsDistrebution,
  onCalculateFitness,
  onFinish
) {
  function getRandomQuestion() {
    const question = getRandomUtil.generateQuestion(questionPool);
    return question;
  }

  const questionChromosome = new Chromosome(
    numberOfQuestions,
    getRandomQuestion,
    (genes, rate) => {
      const mutauedChromosomes = geneticAlgorithmConfig.mutate(
        genes,
        rate,
        getRandomQuestion
      );
      return mutauedChromosomes;
    }
  );

  // Create an Individual with this chromosome
  const individual = new Individual(questionChromosome);

  class ExamSimulation extends Simulation {
    calculateFitness(individual) {
      const fitness = geneticAlgorithmConfig.calculateFitness(
        individual,
        difficulty,
        objective,
        questionsDistrebution
      );
      return fitness;
    }

    shouldFinish(topIndividual) {
      return geneticAlgorithmConfig.shouldFinish(
        topIndividual,
        questionsDistrebution.length
      );
    }
  }

  const config = geneticAlgorithmConfig.getSimulationConfig(
    individual,
    onCalculateFitness,
    onFinish
  );

  return new ExamSimulation(config);
}

const findOptimumExam = async (
  questionPool,
  numberOfQuestions,
  difficulty,
  objective,
  chapters
) => {
  return new Promise((resolve, reject) => {
    let bestChoise;
    let curMaxFitness = 0;

    function onCalculateFitness(state) {
      if (state.top.fitness >= curMaxFitness) {
        bestChoise = state.top.getDna(0);
        curMaxFitness = state.top.fitness;
      }
    }

    const numberOfNeededChapters = Object.values(chapters).length;

    // 5 represent here the reward for matching difficult, simple, creativity, understanding, and reminding
    const MaxAvailableFitness = numberOfNeededChapters + 5;

    function onFinish(state) {
      console.log("Simulation Finished");
      const MaxFitnessScored = (curMaxFitness / MaxAvailableFitness) * 100;
      console.log(
        `Exam matches your conditions by ${MaxFitnessScored}%`
      );
      resolve(bestChoise);
    }

    const examSim = getSimulation(
      questionPool,
      numberOfQuestions,
      difficulty,
      objective,
      chapters,
      onCalculateFitness,
      onFinish
    );

    try {
      examSim.start();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getSimulation, findOptimumExam };
