import React from "react";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import Chapter from "../components/Chapter";
import { useParams } from "react-router-dom";
import api from "../api/api";
import PageTitle from "../components/PageTitle";

const CourseChaptersPage = () => {
  const { courseId } = useParams();

  const notify = useNotifier();
  const { data: course, isLoading: isCourseLoading } = useFetchData(
    ["courses", courseId],
    async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}`);
        return response.data.data;
      } catch (error) {
        console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );
  const { data: chapters, isLoading: isChaptersLoading } = useFetchData(
    ["chapters", courseId],
    async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}/chapters`);
        return response.data.data;
      } catch (error) {
        console.log(error);
        // notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  if (isChaptersLoading || isCourseLoading) {
    return <p>Loading Chapters...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:p-4">
      <PageTitle title={`All Chapters for ${course.name} course`} />
      <hr></hr>
      <div className="flex w-full flex-col gap-2">
        {chapters.map((chapter, index) => (
          <Chapter
            key={index}
            chapterName={chapter.name}
            chapterNumber={chapter.number}
            maxNumberOfQuestions={chapter.maxNumberOfQuestions}
            chapterId={chapter._id}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseChaptersPage;
