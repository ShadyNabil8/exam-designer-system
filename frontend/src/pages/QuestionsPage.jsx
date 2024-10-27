import React, { useEffect } from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import Question from "../components/Question";
import PageTitle from "../components/PageTitle";

const QuestionsPage = () => {
  const notify = useNotifier();
  const { data: questions, isLoading } = useFetchData(
    ["questions"],
    async () => {
      try {
        const response = await api.get("/api/questions");
        return response.data.data;
      } catch (error) {
        // console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  useEffect(() => {
    document.title = "Questions | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading Chapters...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:p-4">
      <PageTitle title={"All Questions"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-2">
        {questions.map((question, index) => (
          <Question
            key={index}
            questionId={question._id}
            questionText={question.text}
            questionChoices={question.choices}
            questionCorrectAnswer={question.correctAnswer}
            questionDifficulty={question.difficulty}
            questionObjective={question.objective}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;
