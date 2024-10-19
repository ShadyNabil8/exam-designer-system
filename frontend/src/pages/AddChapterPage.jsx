import React, { useState, useEffect } from "react";
import AddBtn from "../components/AddBtn";
import InputField from "../components/InputField";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import Dropdown from "../components/Dropdown";

const AddChapterPage = () => {
  const [chapterName, setChapterName] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterMaxNumOfQuestions, setChapterMaxNumOfQuestions] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const notify = useNotifier();
  const { data: courses, isLoading } = useFetchData(["courses"], async () => {
    try {
      const response = await api.get("/api/courses");
      return response.data.data;
    } catch (error) {
      notify.error(error.response?.data?.message || "Something went wrong!");
    }
  });

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-10">
      <InputField
        value={chapterName}
        fieldName="Name"
        placeholder="e.g.,Dynamic programming"
        onFieldChange={(e) => setChapterName(e.target.value)}
      />
      <InputField
        value={chapterNumber}
        fieldName="Number"
        placeholder="e.g.,1"
        onFieldChange={(e) => setChapterNumber(e.target.value)}
      />
      <InputField
        value={chapterMaxNumOfQuestions}
        fieldName="Maximum number of questions"
        placeholder="e.g.,12"
        onFieldChange={(e) => setChapterMaxNumOfQuestions(e.target.value)}
      />
      <Dropdown
        selectedOption={selectedCourse}
        setSelectedOption={setSelectedCourse}
        title="Select a course"
      >
        {courses.map((course, index) => (
          <option key={index} value={course._id}>
            {course.name}
          </option>
        ))}
      </Dropdown>
      <AddBtn
        itemTypeName="Chapter"
        postUrl="/api/chapters"
        redirectUrl="/chapters"
        data={{
          name: chapterName,
          number: chapterNumber,
          maxNumberOfQuestions: chapterMaxNumOfQuestions,
          courseId: selectedCourse,
        }}
      />
    </div>
  );
};

export default AddChapterPage;
