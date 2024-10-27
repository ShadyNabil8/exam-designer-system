import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdatePageBtn from "../components/UpdatePageBtn";
import Detail from "../components/Detail";
import PageTitle from "../components/PageTitle";

const ChapterPage = () => {
  const { chapterId } = useParams();

  const { data: chapter, isLoading } = useFetchData(
    ["chapters", chapterId],
    async () => {
      try {
        const response = await api.get(`/api/chapters/${chapterId}`);
        return response.data.data;
      } catch (error) {
        // console.log(error);
      }
    },
  );

  useEffect(() => {
    document.title = "Chapter Details | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Chapter details"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Detail detailTitle="Name" detailData={chapter.name} />
          <Detail detailTitle="Course name" detailData={chapter.course.name} />
          <Detail detailTitle="Number" detailData={chapter.number} />
          <Detail
            detailTitle="Maximum number of questions"
            detailData={chapter.maxNumberOfQuestions}
          />
          <Detail
            detailTitle="Maximum number of difficulty"
            detailData={chapter.maxNumberOfEachDifficulty}
          />
          <Detail
            detailTitle="Maximum number of objective"
            detailData={chapter.maxNumberOfEachObjective}
          />
          <Link
            to={`/chapters/${chapterId}/questions`}
            className="text-blue-600 underline"
          >
            Questions
          </Link>
        </div>
        <div className="flex gap-7">
          <DeleteBtn
            deleteUrl={`/api/chapters/${chapterId}`}
            redirectUrl="/chapters"
          />
          <UpdatePageBtn updateUrl={`/chapters/${chapterId}/update`} />
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
