import React from "react";
import Chapter from "../components/Chapter";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";

const ChaptersPage = () => {
  const notify = useNotifier();
  const { data: chapters, isLoading } = useFetchData(["chapters"], async () => {
    try {
      const response = await api.get("/api/chapters");      
      return response.data.data;
    } catch (error) {
      notify.error(error.response?.data?.message || "Something went wrong!");
    }
  });

  if (isLoading) {
    return <p>Loading courses...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      {chapters.map((chapter, index) => (
        <Chapter
          key={index}
          chapterName={chapter.name}
          chapterNumber={chapter.number}
          // courseName={chapter.course.name}
          // maxNumberOfQuestions={chapter.maxNumberOfQuestions}
        />
      ))}
    </div>
  );
};

export default ChaptersPage;
