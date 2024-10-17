const genie = require("@adrianperea/genie.js");
const { Simulation, Individual, Chromosome } = genie;
const geneticAlgorithmConfig = require("../config/geneticAlgorithmConfig");
const getRandomUtil = require("../utils/getRandomUtil");
const { on } = require("../models/questionModel");

function getSimulation(
  numberOfQuestions,
  maxSimple,
  maxDifficult,
  maxReminding,
  maxUnderstanding,
  maxCreativity,
  questionsDistrebution,
  onCalculateFitness,
  onFinish
) {
  const questionChromosome = new Chromosome(
    numberOfQuestions,
    getRandomUtil.generateQuestion,
    (genes, rate) => {
      const mutauedChromosomes = geneticAlgorithmConfig.mutate(
        genes,
        rate,
        getRandomUtil.generateQuestion
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
        maxSimple,
        maxDifficult,
        maxReminding,
        maxUnderstanding,
        maxCreativity,
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

  let bestChoise;
  let maxFitness = 0;

  const config = geneticAlgorithmConfig.getSimulationConfig(
    individual,
    onCalculateFitness,
    onFinish
  );

  return new ExamSimulation(config);
}

const findOptimumExam = async (
  numberOfQuestions,
  simpleQuestions,
  difficultQuestions,
  remindingQuestions,
  understandingQuestions,
  creativityQuestions,
  chapters
) => {
  return new Promise((resolve, reject) => {
    let bestChoise;
    let maxFitness = 0;

    function onCalculateFitness(state) {
      if (state.top.fitness > maxFitness) {
        bestChoise = state.top.getDna(0);
        maxFitness = state.top.fitness;
        // console.log(`New max fitness: ${maxFitness}`);
      }
    }
    function onFinish(state) {
      console.log("Simulation Finished");
      console.log(`Max fitness scored is ${maxFitness}/8`);
      resolve(bestChoise);
    }

    const examSim = getSimulation(
      numberOfQuestions,
      simpleQuestions,
      difficultQuestions,
      remindingQuestions,
      understandingQuestions,
      creativityQuestions,
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
