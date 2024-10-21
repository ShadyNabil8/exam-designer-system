import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingDeleteBtn from "./FloatingDeleteBtn";
import moment from "moment";
const Exam = ({
  examId,
  courseName,
  examName,
  createdAt,
  numberOfQuestions,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      to={`/exams/${examId}`}
      className="relative w-full rounded-sm border p-4 transition-colors hover:bg-[#fcfcfcf2]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-1">
        <div className="text-lg font-medium">{examName}</div>
        <div className="text-lg">{`Course Name: ${courseName}`}</div>
        <div className="text-lg">{`Created At: ${moment(createdAt).format("LLLL")}`}</div>
        <div className="text-lg">{`Number Of questions: ${numberOfQuestions}`}</div>
      </div>
      {isHovered && (
        <div className="vertical-center absolute right-4">
          <FloatingDeleteBtn
            deleteUrl={`api/exams/${examId}`}
            queryKey={["exams"]}
          />
        </div>
      )}
    </Link>
  );
};

export default Exam;
