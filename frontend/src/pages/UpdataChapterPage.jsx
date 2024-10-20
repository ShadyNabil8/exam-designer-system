import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import PageTitle from "../components/PageTitle";
import UpdataBtn from "../components/UpdataBtn";
import InputField from "../components/InputField";

const UpdataChapterPage = () => {
  const [updatedChapterName, setUpdatedChapterName] = useState("");
  const [updatedChapterNumber, setUpdatedChapterNumber] = useState("");

  const { chapterId } = useParams();

  const { data: chapter, isLoading } = useFetchData(
    ["chapters", chapterId],
    async () => {
      try {
        const response = await api.get(`/api/chapters/${chapterId}`);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  );

  useEffect(() => {
    if (!isLoading) {
      setUpdatedChapterName(chapter.name);
      setUpdatedChapterNumber(chapter.number);
    }
  }, [chapter]);

  if (isLoading) {
    return <p>Loading course...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Update chapter"} />
      <hr></hr>
      <div className="flex flex-col gap-4">
        <InputField
          value={updatedChapterName}
          fieldName="Name"
          placeholder="e.g.,CS50"
          onFieldChange={(e) => setUpdatedChapterName(e.target.value)}
        />
        <InputField
          value={updatedChapterNumber}
          fieldName="Number"
          placeholder="e.g.,10"
          onFieldChange={(e) => setUpdatedChapterNumber(e.target.value)}
        />
        <UpdataBtn
          itemTypeName="Chapter"
          updateUrl={`/api/chapters/${chapterId}`}
          redirectUrl="/chapters" // The chapter id will be added to go the the chapter page
          updatedData={{
            name: updatedChapterName,
            number: updatedChapterNumber,
            maxNumberOfQuestions: chapter.maxNumberOfQuestions, // To de handled in feture update
            courseId: chapter.courseId, // To de handled in feture update
          }}
        />
      </div>
    </div>
  );
};

export default UpdataChapterPage;
