import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingDeleteBtn from "./FloatingDeleteBtn";
import FloatingUpdateBtn from "./FloatingUpdateBtn";

const Course = ({ courseName, courseNumberOfChapters, courseId }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      to={`/courses/${courseId}`}
      className="relative w-full rounded-sm border p-4 transition-colors hover:bg-[#fcfcfcf2]"
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
        <div className="vertical-center absolute gap-2 right-4">
          <FloatingDeleteBtn
            deleteUrl={`api/courses/${courseId}`}
            queryKey={["courses"]}
          />
          <FloatingUpdateBtn updateUrl={`/courses/${courseId}/update`} />
        </div>
      )}
    </Link>
  );
};

export default Course;
