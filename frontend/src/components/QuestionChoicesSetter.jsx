import React, { useEffect, useState } from "react";
import { BsArrowReturnLeft } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const QuestionChoicesSetter = ({ choices, setChoices }) => {
  const [newChoice, setNewChoice] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{"Choices"}</span>
      {choices.map((choice, index) => (
        <div
          key={index}
          className="relative flex w-full items-center rounded-md border p-2 pr-8 focus:outline-none"
        >
          {choice}
          <button
            className="absolute right-2 flex items-center text-2xl"
            onClick={(e) =>
              setChoices((prev) =>
                prev.filter((prevChoice) => choice != prevChoice),
              )
            }
          >
            <MdDelete className="text-red-500" />
          </button>
        </div>
      ))}
      <div className="relative flex items-center rounded-md border">
        <input
          className="grow rounded-md p-2 focus:outline-none"
          name={"choice"}
          value={newChoice}
          placeholder="Enter a choice"
          onChange={(e) => setNewChoice(e.target.value)}
        ></input>
        {newChoice && (
          <button
            className="absolute right-2 flex items-center gap-1 rounded-md bg-[#007AFF] px-2 py-1 text-sm text-white"
            onClick={(e) => {
              setNewChoice("");
              setChoices((prev) => [...prev, newChoice]);
            }}
          >
            <BsArrowReturnLeft />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionChoicesSetter;
