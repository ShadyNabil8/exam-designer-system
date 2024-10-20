import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingDeleteBtn from "../components/FloatingDeleteBtn";
import FloatingUpdateBtn from "./FloatingUpdateBtn";

const Chapter = ({
  chapterName,
  chapterNumber,
  maxNumberOfQuestions,
  chapterId,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/chapters/${chapterId}`}
      className="relative w-full rounded-sm border p-4 transition-colors hover:bg-[#fcfcfcf2]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="font-bold">Name</div>
        <div className="font-bold">Number</div>
        <div className="font-bold">Maximum number of questions</div>
        <div>{chapterName}</div>
        <div>{chapterNumber}</div>
        <div>{maxNumberOfQuestions}</div>
      </div>
      {isHovered && (
        <div className="vertical-center absolute right-4 gap-2">
          <FloatingDeleteBtn
            deleteUrl={`api/chapters/${chapterId}`}
            queryKey={["chapters"]}
          />
          <FloatingUpdateBtn updateUrl={`/chapters/${chapterId}/update`} />
        </div>
      )}
    </Link>
  );
};

export default Chapter;
