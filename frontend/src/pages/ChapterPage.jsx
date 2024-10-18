import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataBtn from "../components/UpdataBtn";

const ChapterPage = () => {
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

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <p className="text-3xl">Chapter Details</p>
      <div>
        <div className="flex gap-2">
          <span className="font-bold">Name:</span>
          <span className="">{chapter.name}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Number:</span>
          <span className="">{chapter.number}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Maximum number of questions:</span>
          <span className="">{chapter.maxNumberOfQuestions}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Maximum number of each difficulty:</span>
          <span className="">{chapter.maxNumberOfEachDifficulty}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Maximum number of each objective:</span>
          <span className="">{chapter.maxNumberOfEachObjective}</span>
        </div>
      </div>
      <div className="flex gap-7">
        <DeleteBtn
          deleteUrl={`/api/chapters/${chapterId}`}
          redirectUrl="/chapters"
        />
        <UpdataBtn updateUrl={`/chapters/${chapterId}/update`} />
      </div>
    </div>
  );
};

export default ChapterPage;
