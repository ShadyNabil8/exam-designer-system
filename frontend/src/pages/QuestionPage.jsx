import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataBtn from "../components/UpdataBtn";

const QuestionPage = () => {
  const { questionId } = useParams();

  const { data: question, isLoading } = useFetchData(
    ["questions", questionId],
    async () => {
      try {
        const response = await api.get(`/api/questions/${questionId}`);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  );

  if (isLoading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <p className="text-3xl">Question Details</p>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="font-bold">Text:</span>
          <span className="">{question.text}</span>
        </div>
        <ul className="flex list-disc flex-col gap-1 px-6">
          {question.choices.map((choice, index) => (
            <li key={index}>{choice}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <span className="font-bold">Correct answer:</span>
          <span className="">{question.correctAnswer}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Difficulty:</span>
          <span className="">{question.difficulty}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Objective:</span>
          <span className="">{question.objective}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Chapter name:</span>
          <span className="">{question.chapter.name}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Chapter number:</span>
          <span className="">{question.chapter.number}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Course name:</span>
          <span className="">{question.chapter.course.name}</span>
        </div>
      </div>
      <div className="flex gap-7">
        <DeleteBtn
          deleteUrl={`/api/questions/${questionId}`}
          redirectUrl="/questions"
        />
        <UpdataBtn updateUrl={`/questions/${questionId}/update`} />
      </div>
    </div>
  );
};

export default QuestionPage;
