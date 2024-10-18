import React from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import DeleteBtn from "../components/DeleteBtn";
import UpdataBtn from "../components/UpdataBtn";
import Detail from "../components/Detail";

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
      <div className="flex flex-col gap-2">
        <Detail detailTitle="Name" detailData={chapter.name} />
        <Detail detailTitle="Number" detailData={chapter.number} />
        <Detail
          detailTitle="Maximum number of questions"
          detailData={chapter.maxNumberOfEachDifficulty}
        />
        <Detail
          detailTitle="Maximum number of objective"
          detailData={chapter.maxNumberOfEachObjective}
        />
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
