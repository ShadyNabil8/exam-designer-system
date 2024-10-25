import React, { useEffect } from "react";
import Course from "../components/Course";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import PageTitle from "../components/PageTitle";

const CoursesPage = () => {
  const notify = useNotifier();
  const { data: courses, isLoading } = useFetchData(["courses"], async () => {
    try {
      const response = await api.get("/api/courses");
      return response.data.data;
    } catch (error) {
      console.log(error);
      // notify.error(error.response?.data?.message || "Something went wrong!");
    }
  });

  useEffect(() => {
    document.title = "Courses | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading courses...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:p-4">
      <PageTitle title={"All Courses"} />
      <hr></hr>
      <div className="flex w-full flex-col gap-2">
        {courses?.map((course, index) => (
          <Course
            key={index}
            courseName={course.name}
            courseNumberOfChapters={course.numberOfChapters}
            courseId={course._id}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
