import React, { useState, useEffect } from "react";
import AddBtn from "../components/AddBtn";
import InputField from "../components/InputField";
const AddCoursePage = () => {
  const [courseName, setCourseName] = useState("");

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <p className="text-3xl">Add new cource</p>
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
