import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingDeleteBtn from "./FloatingDeleteBtn";

const Question = ({
  questionId,
  questionText,
  questionChoices,
  questionCorrectAnswer,
  questionDifficulty,
  questionObjective,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      to={`/questions/${questionId}`}
      className="relative w-full rounded-sm border p-4 transition-colors hover:bg-[#fcfcfcf2]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {isHovered && (
        <div className="vertical-center absolute right-4">
          <FloatingDeleteBtn
            deleteUrl={`api/questions/${questionId}`}
            queryKey={["questions"]}
          />
        </div>
      )}
    </Link>
  );
};

export default Question;
