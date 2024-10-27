import React, { useEffect } from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import Question from "../components/Question";
import { useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import GeneratedQuestion from "../components/GeneratedQuestion";

const ExamQuestionsPage = () => {
  const { examId } = useParams();

  const notify = useNotifier();

  const { data: exam, isLoading: isExamLoading } = useFetchData(
    ["exams", examId],
    async () => {
      try {
        const response = await api.get(`/api/exams/${examId}`);
        return response.data.data;
      } catch (error) {
        // console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  const { data: questions, isLoading: isQuestionsLoading } = useFetchData(
    ["questions", examId],
    async () => {
      try {
        const response = await api.get(`/api/exams/${examId}/questions`);
        console.log(response.data.data);

        return response.data.data;
      } catch (error) {
        console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  useEffect(() => {
    document.title = "Exam Questions | Exam Generation System";
  }, []);

  if (isExamLoading || isQuestionsLoading) {
    return <p>Loading Questions...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:p-4">
      <PageTitle title={`All Questions of ${exam.name} exam`} />
      <hr></hr>
      <div className="flex w-full flex-col gap-2">
        {questions.map((question, index) => (
          <GeneratedQuestion
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

export default ExamQuestionsPage;
