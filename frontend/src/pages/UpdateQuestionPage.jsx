import React, { useState, useEffect, useRef } from "react";
import AddBtn from "../components/AddBtn";
import InputField from "../components/InputField";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import Dropdown from "../components/Dropdown";
import QuestionChoicesSetter from "../components/QuestionChoicesSetter";
import PageTitle from "../components/PageTitle";
import { useParams } from "react-router-dom";
import UpdataBtn from "../components/UpdataBtn";

const UpdateQuestionPage = () => {
  const [questionText, setQuestionTest] = useState("");
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState("");
  const [questionChoices, setQuestionChoices] = useState([]);
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionObjective, setQuestionObjective] = useState("");
  const [questionChapter, setQuestionChapter] = useState("");
  // const [questionCourse, setQuestionCourse] = useState("");
  // const [chaptersList, setChaptersList] = useState([]);

  const notify = useNotifier();
  const { questionId } = useParams();

  const { data: question, isLoading: isQuestionLoading } = useFetchData(
    ["questions", questionId],
    async () => {
      try {
        const response = await api.get(`/api/questions/${questionId}`);
        return response.data.data;
      } catch (error) {
        notify.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  );

  // const { data: courses, isLoading: isCourseLoading } = useFetchData(
  //   ["courses"],
  //   async () => {
  //     try {
  //       const response = await api.get("/api/courses");
  //       return response.data.data;
  //     } catch (error) {
  //       notify.error(error.response?.data?.message || "Something went wrong!");
  //     }
  //   },
  // );

  // useEffect(() => {
  //   const getCourseChapters = async () => {
  //     try {
  //       const response = await api.get(
  //         `/api/courses/${questionCourse}/chapters`,
  //       );
  //       setChaptersList(response.data.data);
  //     } catch (error) {
  //       notify.error(error.response?.data?.message || "Something went wrong!");
  //     }
  //   };
  //   if (questionCourse && !isFirstMount.current) {
  //     // Clear the current selected chapter when selected course changes.
  //     setQuestionChapter("");
  //     getCourseChapters();
  //   }
  // }, [questionCourse]);

  useEffect(() => {
    if (!isQuestionLoading) {
      setQuestionTest(question.text);
      setQuestionCorrectAnswer(question.correctAnswer);
      setQuestionChoices(question.choices);
      setQuestionDifficulty(question.difficulty);
      setQuestionObjective(question.objective);
      setQuestionChapter(question.chapterId);
    }
  }, [question]);

  useEffect(() => {
    document.title = "Update Question | Exam Generation System";
  }, []);

  if (isQuestionLoading /*|| isCourseLoading*/) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 sm:w-1/2 lg:w-1/4 lg:p-4">
      <PageTitle title={"Update question"} />
      <hr></hr>
      <div className="flex flex-col gap-4">
        <InputField
          value={questionText}
          fieldName="Text"
          placeholder="e.g.,What is the capital of Egypt"
          onFieldChange={(e) => setQuestionTest(e.target.value)}
        />
        <QuestionChoicesSetter
          choices={questionChoices}
          setChoices={setQuestionChoices}
        />
        <InputField
          value={questionCorrectAnswer}
          fieldName="Correct answer"
          placeholder="e.g.,Cairo"
          onFieldChange={(e) => setQuestionCorrectAnswer(e.target.value)}
        />
        <Dropdown
          title="Select an difficulty"
          selectedOption={questionDifficulty}
          setSelectedOption={setQuestionDifficulty}
        >
          {["simple", "difficult"].map((difficulty, index) => (
            <option key={index} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </Dropdown>
        <Dropdown
          title="Select an Objective"
          selectedOption={questionObjective}
          setSelectedOption={setQuestionObjective}
        >
          {["reminding", "understanding", "creativity"].map(
            (objective, index) => (
              <option key={index} value={objective}>
                {objective}
              </option>
            ),
          )}
        </Dropdown>
        {/* <Dropdown
          title="Select a course"
          selectedOption={questionCourse}
          setSelectedOption={setQuestionCourse}
        >
          {courses.map((course, index) => (
            <option key={index} value={course._id}>
              {course.name}
            </option>
          ))}
        </Dropdown>
        <Dropdown
          title="Select a chapter"
          selectedOption={questionChapter}
          setSelectedOption={setQuestionChapter}
        >
          {chaptersList.map((chapter, index) => (
            <option key={index} value={chapter._id}>
              {chapter.name}
            </option>
          ))}
        </Dropdown> */}
        <UpdataBtn
          itemTypeName="Question"
          updateUrl={`/api/questions/${questionId}`}
          redirectUrl="/questions"
          updatedData={{
            text: questionText,
            choices: questionChoices,
            correctAnswer: questionCorrectAnswer,
            difficulty: questionDifficulty,
            objective: questionObjective,
            chapterId: questionChapter,
          }}
        />
      </div>
    </div>
  );
};

export default UpdateQuestionPage;
