import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataBtn from "../components/UpdataBtn";
import Detail from "../components/Detail";
import PageTitle from "../components/PageTitle";

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
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Question Details"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Detail detailTitle="Text" detailData={question.text} />
          <ul className="flex list-disc flex-col gap-1 px-6">
            {question.choices.map((choice, index) => (
              <li key={index}>{choice}</li>
            ))}
          </ul>
          <Detail
            detailTitle="Correct answer"
            detailData={question.correctAnswer}
          />
          <Detail detailTitle="Difficulty" detailData={question.difficulty} />
          <Detail detailTitle="Objective" detailData={question.objective} />
          <Detail
            detailTitle="Chapter name"
            detailData={question.chapter.name}
          />
          <Detail
            detailTitle="Chapter number"
            detailData={question.chapter.number}
          />
          <Detail
            detailTitle="Course name"
            detailData={question.chapter.course.name}
          />
        </div>
        <div className="flex gap-7">
          <DeleteBtn
            deleteUrl={`/api/questions/${questionId}`}
            redirectUrl="/questions"
          />
          <UpdataBtn updateUrl={`/questions/${questionId}/update`} />
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
