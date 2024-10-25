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
import RootPage from "../pages/RootPage";
import UpdataCoursePage from "../pages/UpdataCoursePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "../pages/ProtectedRoute";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import UpdataChapterPage from "../pages/UpdataChapterPage";
import ExamsPage from "../pages/ExamsPage";
import ExamPage from "../pages/ExamPage";
import ExamQuestionsPage from "../pages/ExamQuestionsPage";
import UpdateQuestionPage from "../pages/UpdateQuestionPage";
import LandingPage from "../pages/LandingPage";
const router = createBrowserRouter([
  {
    path: "/about",
    element: <LandingPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootPage />,
        children: [
          {
            path: "/courses",
            element: <CoursesPage />,
          },
          {
            path: "/courses/:courseId",
            element: <CoursePage />,
          },
          {
            path: "/courses/:courseId/chapters",
            element: <CourseChaptersPage />,
          },
          {
            path: "/courses/:courseId/update",
            element: <UpdataCoursePage />,
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
            path: "/chapters/:chapterId",
            element: <ChapterPage />,
          },
          {
            path: "/chapters/:chapterId/update",
            element: <UpdataChapterPage />,
          },
          {
            path: "/chapters/:chapterId/questions",
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
            path: "/questions/:questionId",
            element: <QuestionPage />,
          },
          {
            path: "/questions/:questionId/update",
            element: <UpdateQuestionPage />,
          },
          {
            path: "/add-question",
            element: <AddQuestionPage />,
          },
          {
            path: "/generate-exam",
            element: <GenerateExamPage />,
          },
          {
            path: "/exams",
            element: <ExamsPage />,
          },
          {
            path: "/exams/:examId",
            element: <ExamPage />,
          },
          {
            path: "/exams/:examId/questions",
            element: <ExamQuestionsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
]);

export default router;
