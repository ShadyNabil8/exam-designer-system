import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataBtn from "../components/UpdataBtn";

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
    <div className="flex w-full flex-col gap-5 p-4">
      <p className="text-3xl">Course Details</p>
      <div>
        <div className="flex gap-2">
          <span className="font-bold">Name:</span>
          <span className="">{course.name}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Number of chapters:</span>
          <span className="">{course.numberOfChapters}</span>
        </div>
      </div>
      <div className="flex gap-7">
        <DeleteBtn
          deleteUrl={`/api/courses/${courseId}`}
          redirectUrl="/courses"
        />
        <UpdataBtn updateUrl={`/courses/${courseId}/update`} />
      </div>
    </div>
  );
};

export default CoursePage;
