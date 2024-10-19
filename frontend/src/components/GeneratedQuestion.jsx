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
      className="relative w-full rounded-sm border p-4 transition-colors hover:bg-[#fcfcfcf2]"
    >
      <div className="flex flex-col">
        <div className="text-lg font-medium">{questionText}</div>
        <ul className="flex list-disc flex-col justify-between pl-5 pr-[10%] md:flex-row">
          {questionChoices.map((choice, index) => (
            <li
              key={index}
              style={{
                fontWeight: choice === questionCorrectAnswer ? "bold" : "",
                textDecorationLine:
                  choice === questionCorrectAnswer ? "underline" : "",
              }}
            >
              {choice}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          {`Difficulty: ${questionDifficulty}. Objective: ${questionObjective}`}
        </div>
      </div>
    </Link>
  );
};

export default GeneratedQuestion;
