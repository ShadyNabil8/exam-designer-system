import React, { useEffect } from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import Question from "../components/Question";
import { useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";

const ChapterQuestionsPage = () => {
  const { chapterId } = useParams();

  const notify = useNotifier();

  useEffect(() => {
    document.title = "Chapter Questions | Exam Generation System";
  }, []);

  const { data: chapter, isLoading: isChapterLoading } = useFetchData(
    ["chapters", chapterId],
    async () => {
      try {
        const response = await api.get(`/api/chapters/${chapterId}`);
        return response.data.data;
      } catch (error) {
        console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  const { data: questions, isLoading: isQuestionsLoading } = useFetchData(
    ["questions", chapterId],
    async () => {
      try {
        const response = await api.get(`/api/chapters/${chapterId}/questions`);
        return response.data.data;
      } catch (error) {
        console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  if (isChapterLoading || isQuestionsLoading) {
    return <p>Loading Questions...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:p-4">
      <PageTitle title={`All Questions of ${chapter.name} chapter`} />
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

export default ChapterQuestionsPage;
