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
    let maxFitness = 0;

    function onCalculateFitness(state) {
      if (state.top.fitness >= maxFitness) {
        bestChoise = state.top.getDna(0);
        maxFitness = state.top.fitness;
        // console.log(`New max fitness: ${maxFitness}`);
      }
    }

    const numberOfNeededChapters = Object.values(chapters).length;

    function onFinish(state) {
      console.log("Simulation Finished");
      console.log(
        `Max fitness scored is ${maxFitness}/${numberOfNeededChapters + 5}`
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
