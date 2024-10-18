import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingDeleteBtn from "./FloatingDeleteBtn";

const Course = ({ courseName, courseNumberOfChapters, courseId }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      to={`/courses/${courseId}`}
      className="relative w-full rounded-md border border-gray-400 p-4 transition-colors hover:bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="font-bold">Name</div>
        <div className="font-bold">Chapters</div>
        <div>{courseName}</div>
        <div>{courseNumberOfChapters}</div>
      </div>
      {isHovered && (
        <div className="vertical-center absolute right-4">
          <FloatingDeleteBtn
            deleteUrl={`api/courses/${courseId}`}
            queryKey={["courses"]}
          />
        </div>
      )}
    </Link>
  );
};

export default Course;
