import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataPageBtn from "../components/UpdatePageBtn";
import Detail from "../components/Detail";
import PageTitle from "../components/PageTitle";

const CoursePage = () => {
  const { courseId } = useParams();

  const { data: course, isLoading } = useFetchData(
    ["courses", courseId],
    async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}`);
        return response.data.data;
      } catch (error) {
        // console.log(error);
      }
    },
  );

  useEffect(() => {
    document.title = "Course Details | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Course Details"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Detail detailTitle="Name" detailData={course.name} />
          <Detail
            detailTitle="Number of chapters"
            detailData={course.numberOfChapters}
          />
          <Link
            to={`/courses/${courseId}/chapters`}
            className="text-blue-600 underline"
          >
            Chapters
          </Link>
        </div>
        <div className="flex gap-7">
          <DeleteBtn
            deleteUrl={`/api/courses/${courseId}`}
            redirectUrl="/courses"
          />
          <UpdataPageBtn updateUrl={`/courses/${courseId}/update`} />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
