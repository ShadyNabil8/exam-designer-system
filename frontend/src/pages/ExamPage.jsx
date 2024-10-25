import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataPageBtn from "../components/UpdatePageBtn";
import Detail from "../components/Detail";
import PageTitle from "../components/PageTitle";
import moment from "moment";

const ExamPage = () => {
  const { examId } = useParams();

  const { data: exam, isLoading } = useFetchData(
    ["exams", examId],
    async () => {
      try {
        const response = await api.get(`/api/exams/${examId}`);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  );

  useEffect(() => {
    document.title = "Exam Details | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading exams...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Exam Details"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Detail detailTitle="Name" detailData={exam.name} />
          <Detail detailTitle="Course Name" detailData={exam.course.name} />
          <Detail
            detailTitle="Created At"
            detailData={moment(exam.createdAt).format("LLLL")}
          />
          <p className="font-bold">Objective Distribution</p>
          <ul className="flex list-disc flex-col gap-1 px-6">
            {Object.keys(exam.objectiveDistribution).map((objective, index) => (
              <li
                key={index}
              >{`${objective}: ${exam.objectiveDistribution[objective]}`}</li>
            ))}
          </ul>
          <p className="font-bold">Difficulty Distribution</p>
          <ul className="flex list-disc flex-col gap-1 px-6">
            {Object.keys(exam.difficultyDistribution).map(
              (difficulty, index) => (
                <li
                  key={index}
                >{`${difficulty}: ${exam.difficultyDistribution[difficulty]}`}</li>
              ),
            )}
          </ul>
          <p className="font-bold">Chapters Distribution</p>
          <ul className="flex list-disc flex-col gap-1 px-6">
            {exam.chaptersDistribution.map((chapter, index) => (
              <li
                key={index}
              >{`${chapter.name}: ${chapter.numberOfQuestionsInExam} questions`}</li>
            ))}
          </ul>
          <Detail
            detailTitle="Number Of Questions"
            detailData={exam.numberOfQuestions}
          />
        </div>
        <Link
          to={`/exams/${examId}/questions`}
          className="text-blue-600 underline"
        >
          Questions
        </Link>
        <div className="flex gap-7">
          <DeleteBtn
            deleteUrl={`/api/exams/${examId}`}
            redirectUrl="/questions"
          />
          <UpdataPageBtn updateUrl={`/questions/${examId}/update`} />
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
