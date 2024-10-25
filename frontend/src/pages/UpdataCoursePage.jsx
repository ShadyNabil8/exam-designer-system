import React, { useState, useEffect } from "react";
import InputField from "../components/InputField";
import PageTitle from "../components/PageTitle";
import api from "../api/api";
import UpdataBtn from "../components/UpdataBtn";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";

const UpdataCoursePage = () => {
  const [updatedCourseName, setUpdatedCourseName] = useState("");

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

  useEffect(() => {
    if (!isLoading) {
      setUpdatedCourseName(course.name);
    }
  }, [course]);

  useEffect(() => {
    document.title = "Update Course | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading course...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Update course"} />
      <hr></hr>
      <div className="flex flex-col gap-4">
        <InputField
          value={updatedCourseName}
          fieldName="Name"
          placeholder="e.g.,CS50"
          onFieldChange={(e) => setUpdatedCourseName(e.target.value)}
        />
        <UpdataBtn
          itemTypeName="Course"
          updateUrl={`/api/courses/${courseId}`}
          redirectUrl="/courses" // The course id will be added to go the the course page
          updatedData={{ name: updatedCourseName }}
        />
      </div>
    </div>
  );
};

export default UpdataCoursePage;
