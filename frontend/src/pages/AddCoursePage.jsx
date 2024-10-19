import React, { useState, useEffect } from "react";
import AddBtn from "../components/AddBtn";
import InputField from "../components/InputField";
const AddCoursePage = () => {
  const [courseName, setCourseName] = useState("");

  return (
    <div className="flex flex-col gap-4 px-4 py-10">
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
  );
};

export default AddCoursePage;
