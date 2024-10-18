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
      className="relative w-full rounded-md border border-gray-400 p-4 transition-colors hover:bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-5 gap-4">
        <div className="font-bold">Text</div>
        <div className="font-bold">Choices</div>
        <div className="font-bold">Correct answer</div>
        <div className="font-bold">Difficulty</div>
        <div className="font-bold">Objective</div>
        <div>{questionText}</div>
        <ul className="flex list-disc flex-col gap-1">
          {questionChoices.map((choice, index) => (
            <li key={index}>{choice}</li>
          ))}
        </ul>
        <div>{questionCorrectAnswer}</div>
        <div>{questionDifficulty}</div>
        <div>{questionObjective}</div>
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
