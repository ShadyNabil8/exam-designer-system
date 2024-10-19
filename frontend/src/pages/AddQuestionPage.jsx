import React, { useState, useEffect } from "react";
import AddBtn from "../components/AddBtn";
import InputField from "../components/InputField";
import useNotifier from "../hooks/useNotifier";
import useFetchData from "../hooks/useFetchData";
import api from "../api/api";
import Dropdown from "../components/Dropdown";
import QuestionChoicesSetter from "../components/QuestionChoicesSetter";

const AddQuestionPage = () => {
  const [questionText, setQuestionTest] = useState("");
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState("");
  const [questionChoices, setQuestionChoices] = useState([]);
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionObjective, setQuestionObjective] = useState("");
  const [questionChapter, setQuestionChapter] = useState("");
  const [questionCourse, setQuestionCourse] = useState("");
  const [chaptersList, setChaptersList] = useState([]);
  const notify = useNotifier();

  const { data: courses, isLoading } = useFetchData(["courses"], async () => {
    try {
      const response = await api.get("/api/courses");
      return response.data.data;
    } catch (error) {
      notify.error(error.response?.data?.message || "Something went wrong!");
    }
  });

  useEffect(() => {
    const getCourseChapters = async () => {
      try {
        const response = await api.get(
          `/api/courses/${questionCourse}/chapters`,
        );
        setChaptersList(response.data.data);
      } catch (error) {
        notify.error(error.response?.data?.message || "Something went wrong!");
      }
    };
    if (questionCourse) {
      // Clear the current selected chapter when selected course changes.
      setQuestionChapter("");
      getCourseChapters();
    }
  }, [questionCourse]);

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-10">
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
      <Dropdown
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
      </Dropdown>
      <AddBtn
        itemTypeName="Question"
        postUrl="/api/questions"
        data={{
          chapterId: questionChapter,
          text: questionText,
          choices: questionChoices,
          correctAnswer: questionCorrectAnswer,
          difficulty: questionDifficulty,
          objective: questionObjective,
        }}
      />
    </div>
  );
};

export default AddQuestionPage;
