import React from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import Question from "../components/Question";
import PageTitle from "../components/PageTitle";
import Exam from "../components/Exam";

const ExamsPage = () => {
  const notify = useNotifier();
  const { data: exams, isLoading } = useFetchData(["exams"], async () => {
    try {
      const response = await api.get("/api/exams");
      return response.data.data;
    } catch (error) {
      console.log(error);
      // notify.error(error.response?.data?.message || "Something went wrong!");
    }
  });

  if (isLoading) {
    return <p>Loading exams...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:p-4">
      <PageTitle title={"All Exams"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-2">
        {exams.map((exam, index) => (
          <Exam
            key={index}
            examId={exam._id}
            courseName={exam.course.name}
            examName={exam.name}
            createdAt={exam.createdAt}
            numberOfQuestions={exam.numberOfQuestions}
          />
        ))}
      </div>
    </div>
  );
};

export default ExamsPage;
