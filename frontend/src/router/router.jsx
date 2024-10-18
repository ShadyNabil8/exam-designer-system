import { createBrowserRouter } from "react-router-dom";
import CoursesPage from "../pages/CoursesPage";
import CoursePage from "../pages/CoursePage";
import AddCoursePage from "../pages/AddCoursePage";
import ChaptersPage from "../pages/ChaptersPage";
import ChapterPage from "../pages/ChapterPage";
import AddChapterPage from "../pages/AddChapterPage";
import QuestionsPage from "../pages/QuestionsPage";
import QuestionPage from "../pages/QuestionPage";
import AddQuestionPage from "../pages/AddQuestionPage";
import GenerateExamPage from "../pages/GenerateExamPage";
import CourseChaptersPage from "../pages/CourseChaptersPage";
import ChapterQuestionsPage from "../pages/ChapterQuestionsPage";
const router = createBrowserRouter([
  {
    path: "/courses",
    element: <CoursesPage />,
  },
  {
    path: "/courses/:id",
    element: <CoursePage />,
  },
  {
    path: "/courses/:id/chapters",
    element: <CourseChaptersPage />,
  },
  {
    path: "/add-course",
    element: <AddCoursePage />,
  },
  {
    path: "/chapters",
    element: <ChaptersPage />,
  },
  {
    path: "/chapters/:id",
    element: <ChapterPage />,
  },
  {
    path: "/chapters/:id/question",
    element: <ChapterQuestionsPage />,
  },
  {
    path: "/add-chapter",
    element: <AddChapterPage />,
  },
  {
    path: "/questions",
    element: <QuestionsPage />,
  },
  {
    path: "/questions/:id",
    element: <QuestionPage />,
  },
  {
    path: "/add-question",
    element: <AddQuestionPage />,
  },
  {
    path: "/renerate-exam",
    element: <GenerateExamPage />,
  },
]);

export default router;
