import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import api from "../api/api";
import useFetchData from "../hooks/useFetchData";
import ExamChaptersSetter from "../components/ExamChaptersSetter";
import Dropdown from "../components/Dropdown";
import GeneratedQuestion from "../components/GeneratedQuestion";
import { CgSpinner } from "react-icons/cg";
import useNotifier from "../hooks/useNotifier";
import PageTitle from "../components/PageTitle";

function GenerateExamPage() {
  const [numOfSimpleQuestions, setNumOfSimpleQuestions] = useState("");
  const [numOfDifficultQuestions, setNumOfDifficultQuestions] = useState("");
  const [numOfRemindingQuestions, setNumOfRemindingQuestions] = useState("");
  const [numOfUnderstandingQuestions, setNumOfUnderstandingQuestions] =
    useState("");
  const [numOfCreativityQuestions, setNumOfCreativityQuestions] = useState("");
  const [examName, setExamName] = useState("");
  const [examCourse, setExamCourse] = useState("");
  const [chaptersList, setChaptersList] = useState([]);
  const [chaptersDistribution, setChaptersDistribution] = useState([]);
  const [generatedQuestions, setGeneratedQquestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExamReady, setIsExamReady] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const notify = useNotifier();

  const { data: courses, isLoading } = useFetchData(["courses"], async () => {
    try {
      const response = await api.get("/api/courses");
      return response.data.data;
    } catch (error) {      
      notify.error(error.response?.data?.message || "Something went wrong!");
    }
  });

  const onGenerateExam = async () => {
    try {
      setIsGenerating(true);
      setIsExamReady(false);

      // I will remove the name proberty from each chapter.
      const chaptersData = chaptersDistribution.reduce((acc, curr) => {
        acc[curr.id] = curr.numberOfQuestions;
        return acc;
      }, {});

      const response = await api.post("/api/exams/generate", {
        chapters: chaptersData,
        difficulty: {
          simple: numOfSimpleQuestions,
          difficult: numOfDifficultQuestions,
        },
        objective: {
          reminding: numOfRemindingQuestions,
          understanding: numOfUnderstandingQuestions,
          creativity: numOfCreativityQuestions,
        },
      });
      setGeneratedQquestions(response.data.data);
      setIsExamReady(true);
    } catch (error) {
      notify.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors[0]?.msg ||
          "Something sent wrong",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const onSaveExam = async () => {
    try {
      setIsSaveLoading(true);
      const examQuestionsIds = generatedQuestions.map(
        (question) => question._id,
      );
      // Convert chapters distribution from object to an array.
      const newChaptersDistribution = chaptersDistribution.reduce(
        (acc, chapter) => {
          acc[chapter.id] = chapter.numberOfQuestions;
          return acc;
        },
        {},
      );

      const response = await api.post("/api/exams/", {
        name: examName,
        courseId: examCourse,
        questions: examQuestionsIds,
        chaptersDistribution: newChaptersDistribution,
        difficultyDistribution: {
          simple: numOfSimpleQuestions,
          difficult: numOfDifficultQuestions,
        },
        objectiveDistribution: {
          reminding: numOfRemindingQuestions,
          understanding: numOfUnderstandingQuestions,
          creativity: numOfCreativityQuestions,
        },
      });

      notify.success(response.data?.message || "Exam saved");
    } catch (error) {
      notify.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors[0]?.msg ||
          "Something sent wrong",
      );
    } finally {
      setIsSaveLoading(false);
    }
  };

  useEffect(() => {
    const getCourseChapters = async () => {
      try {
        const response = await api.get(`/api/courses/${examCourse}/chapters`);
        setChaptersList(response.data.data);
      } catch (error) {
        notify.error(error.response?.data?.message || "Something went wrong!");
      }
    };
    if (examCourse) {
      // Clear the current selection.
      setChaptersDistribution([]);
      setChaptersList([]);
      getCourseChapters();
    }
  }, [examCourse]);

  useEffect(() => {
    document.title = "Generate Exam | Exam Generation System";
  }, []);

  if (isLoading) {
    return <p>Loading courses...</p>;
  }
  return (
    <div className="flex w-full flex-col gap-4 p-2 lg:flex-row lg:gap-2 lg:p-4">
      <div className="flex w-full shrink-0 flex-col gap-2 sm:w-1/2 lg:w-1/3">
        <PageTitle title={"Exam Details"} />
        <hr></hr>
        <div className="flex flex-col gap-4">
          <Dropdown
            title="Select a course"
            selectedOption={examCourse}
            setSelectedOption={setExamCourse}
          >
            {courses.map((course, index) => (
              <option key={index} value={course._id}>
                {course.name}
              </option>
            ))}
          </Dropdown>
          <ExamChaptersSetter
            chaptersList={chaptersList}
            distribution={chaptersDistribution}
            setDistribution={setChaptersDistribution}
          />
          <InputField
            value={numOfSimpleQuestions}
            fieldName="Simple questions"
            placeholder="e.g.,CS50"
            onFieldChange={(e) => setNumOfSimpleQuestions(e.target.value)}
          />
          <InputField
            value={numOfDifficultQuestions}
            fieldName="Difficult questions"
            placeholder="e.g.,CS50"
            onFieldChange={(e) => setNumOfDifficultQuestions(e.target.value)}
          />
          <InputField
            value={numOfRemindingQuestions}
            fieldName="Reminding questions"
            placeholder="e.g.,CS50"
            onFieldChange={(e) => setNumOfRemindingQuestions(e.target.value)}
          />
          <InputField
            value={numOfUnderstandingQuestions}
            fieldName="Uunderstanding questions"
            placeholder="e.g.,CS50"
            onFieldChange={(e) =>
              setNumOfUnderstandingQuestions(e.target.value)
            }
          />
          <InputField
            value={numOfCreativityQuestions}
            fieldName="Creativity questions"
            placeholder="e.g.,CS50"
            onFieldChange={(e) => setNumOfCreativityQuestions(e.target.value)}
          />
          <InputField
            value={examName}
            fieldName="Exam Name"
            placeholder="e.g.,Algorithms Final"
            onFieldChange={(e) => setExamName(e.target.value)}
          />
        </div>
        <button
          className="flex h-[40px] max-w-[150px] items-center justify-center rounded-md bg-[#007AFF] p-1 font-medium text-white transition hover:bg-[#2673c4]"
          style={{ pointerEvents: isGenerating ? "none" : "" }}
          onClick={onGenerateExam}
        >
          {isGenerating ? (
            <CgSpinner className="animate-spin text-3xl text-white" />
          ) : (
            "Generate Exam"
          )}
        </button>
        <button
          className="flex h-[40px] max-w-[150px] items-center justify-center rounded-md bg-green-500 p-1 font-medium text-white transition hover:bg-[#4dbe39]"
          style={{
            pointerEvents: isExamReady ? "" : "none",
            opacity: isExamReady ? "1" : "0.5",
          }}
          onClick={onSaveExam}
        >
          {isSaveLoading ? (
            <CgSpinner className="animate-spin text-3xl text-white" />
          ) : (
            "Save Exam"
          )}
        </button>
      </div>
      <div className="h-[1px] w-full self-center border-t lg:h-3/4 lg:w-[1px] lg:border-r"></div>
      <div className="flex grow flex-col gap-2">
        <PageTitle title={"Generated Exam"} />
        <hr></hr>
        <div className="flex flex-col gap-4">
          {generatedQuestions.map((question, index) => (
            <GeneratedQuestion
              key={index}
              questionId={question._id}
              questionText={question.text}
              questionChoices={question.choices}
              questionCorrectAnswer={question.correctAnswer}
              questionDifficulty={question.difficulty}
              questionObjective={question.objective}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenerateExamPage;
