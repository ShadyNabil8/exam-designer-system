import React, { useState, useEffect } from "react";
import AddBtn from "../components/AddBtn";
import InputField from "../components/InputField";
import PageTitle from "../components/PageTitle";
const AddCoursePage = () => {
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    document.title = "Add Course | Exam Generation System";
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Add new course"} />
      <hr></hr>
      <div className="flex flex-col gap-4">
        <InputField
          value={courseName}
          fieldName="Name"
          placeholder="e.g.,CS50"
          onFieldChange={(e) => setCourseName(e.target.value)}
        />
        <AddBtn
          itemTypeName="Course"
          postUrl="/api/courses"
          redirectUrl="/courses"
          data={{ name: courseName }}
        />
      </div>
    </div>
  );
};

export default AddCoursePage;
