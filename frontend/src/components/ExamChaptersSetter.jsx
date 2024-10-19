import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Dropdown from "./Dropdown";
import { BsArrowReturnLeft } from "react-icons/bs";

const ExamChaptersSetter = ({
  chaptersList,
  distribution,
  setDistribution,
}) => {
  const [newChapter, setNewChapter] = useState("");
  const [newChapterNumOfQues, setNewChapterNumOfQues] = useState("");
  const [newChapterName, setNewChapterName] = useState("");

  useEffect(() => {
    const selectedChapter = chaptersList.find(
      (chapter) => chapter._id === newChapter,
    );
    setNewChapterName(selectedChapter?.name || "");
  }, [newChapter]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex items-center">
        <div className="w-[70%]">
          <Dropdown
            title="Select chapters"
            selectedOption={newChapter}
            setSelectedOption={setNewChapter}
          >
            {chaptersList.map((chapter, index) => (
              <option key={index} value={chapter._id}>
                {chapter.name}
              </option>
            ))}
          </Dropdown>
        </div>
        <input
          className="absolute bottom-0 right-0 w-[29%] rounded-md border px-1 py-[7px] focus:outline-none"
          placeholder="e.g.,5"
          value={newChapterNumOfQues}
          name="newChapterNumOfQues"
          onChange={(e) => setNewChapterNumOfQues(e.target.value)}
        ></input>
        {newChapterNumOfQues && newChapter && (
          <button
            className="absolute bottom-[6px] right-1 flex items-center gap-1 rounded-md bg-[#007AFF] px-2 py-1 text-sm text-white"
            onClick={(e) => {
              setNewChapter("");
              setNewChapterNumOfQues("");
              setDistribution((prev) => [
                ...prev,
                {
                  id: newChapter,
                  numberOfQuestions: newChapterNumOfQues,
                  name: newChapterName,
                },
              ]);
            }}
          >
            <BsArrowReturnLeft />
            <span>Add</span>
          </button>
        )}
      </div>
      {distribution.map((chapter, index) => (
        <div
          key={index}
          className="relative flex w-full items-center rounded-md border p-2 focus:outline-none"
        >
          {`${chapter.name}: ${chapter.numberOfQuestions} questions`}
          <button
            className="absolute right-2 flex items-center text-2xl"
            onClick={() =>
              setDistribution((prev) =>
                prev.filter(
                  (filteredChapter) => filteredChapter.id !== chapter.id,
                ),
              )
            }
          >
            <MdDelete className="text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExamChaptersSetter;
