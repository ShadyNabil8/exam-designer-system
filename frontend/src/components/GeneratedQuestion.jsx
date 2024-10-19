import React from "react";
import { Link } from "react-router-dom";

const GeneratedQuestion = ({
  questionId,
  questionText,
  questionChoices,
  questionCorrectAnswer,
  questionDifficulty,
  questionObjective,
}) => {
  return (
    <Link
      to={`/questions/${questionId}`}
      className="relative w-full rounded-md border border-gray-400 p-4 transition-colors hover:bg-gray-50"
    >
      <div
        className="flex flex-col gap-2 sm:grid"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateAreas: `
            "text choices correct difficulty objective"
            "textData choicesData correctData difficultyData objectiveData"
          `,
        }}
      >
        <div className="font-bold" style={{ gridArea: "text" }}>
          Text
        </div>
        <div style={{ gridArea: "textData" }}>{questionText}</div>
        <div className="font-bold" style={{ gridArea: "choices" }}>
          Choices
        </div>
        <ul
          className="flex list-disc flex-col gap-1 pl-3"
          style={{ gridArea: "choicesData" }}
        >
          {questionChoices.map((choice, index) => (
            <li key={index}>{choice}</li>
          ))}
        </ul>
        <div className="font-bold" style={{ gridArea: "correct" }}>
          Correct answer
        </div>
        <div style={{ gridArea: "correctData" }}>{questionCorrectAnswer}</div>
        <div className="font-bold" style={{ gridArea: "difficulty" }}>
          Difficulty
        </div>
        <div style={{ gridArea: "difficultyData" }}>{questionDifficulty}</div>
        <div className="font-bold" style={{ gridArea: "objective" }}>
          Objective
        </div>
        <div style={{ gridArea: "objectiveData" }}>{questionObjective}</div>
      </div>
    </Link>
  );
};

export default GeneratedQuestion;
