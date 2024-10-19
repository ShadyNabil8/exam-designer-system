import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataBtn from "../components/UpdataBtn";
import Detail from "../components/Detail";

const CoursePage = () => {
  const { courseId } = useParams();

  const { data: course, isLoading } = useFetchData(
    ["courses", courseId],
    async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}`);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  );

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <p className="text-3xl">Course Details</p>
      <hr></hr>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Detail detailTitle="Name" detailData={course.name} />
          <Detail
            detailTitle="Number of chapters"
            detailData={course.numberOfChapters}
          />
        </div>
        <div className="flex gap-7">
          <DeleteBtn
            deleteUrl={`/api/courses/${courseId}`}
            redirectUrl="/courses"
          />
          <UpdataBtn updateUrl={`/courses/${courseId}/update`} />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
