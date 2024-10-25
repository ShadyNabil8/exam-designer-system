import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "About | Exam Generation System";
  }, []);

  return (
    <div className="flex min-h-screen flex-col text-gray-900">
      <header className="bg-blue-600 p-8 text-center text-white">
        <h1 className="mb-2 text-4xl font-bold">Exam Generation System</h1>
        <p className="mb-4 text-lg">
          A smart solution for creating customized exams.
        </p>
        <button
          className="rounded-lg bg-green-500 px-6 py-2 text-lg text-white transition hover:bg-green-600"
          onClick={() => navigate("/generate-exam")}
        >
          Get Started
        </button>
      </header>

      <main className="flex-grow">
        <section className="bg-gray-100 py-12 text-center">
          <h2 className="mb-8 text-3xl font-semibold">Key Features</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-blue-600">
                Question Management
              </h3>
              <p>
                Easily add, update, and delete questions for different courses
                and chapters.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-blue-600">
                Advanced Exam Generation
              </h3>
              <p>
                Generate exams based on constraints like chapters, difficulty
                levels, and objectives.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-blue-600">
                Optimized Algorithms
              </h3>
              <p>
                Uses genetic algorithms to optimize question selection for your
                requirements.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-blue-600">
                Secure User Access
              </h3>
              <p>
                Authentication and authorization for secure access to exam
                creation features.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold">About the Project</h2>
          <p className="mx-auto max-w-3xl">
            This project is designed to assist teachers in creating exams by
            selecting questions from a pool based on specific constraints. With
            this system, users can optimize question selection, ensuring exams
            are balanced across chapters, objectives, and difficulty levels.
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 py-4 text-center text-white">
        <p>
          © 2024 Exam Generation System | Created for Intlaq Backend Engineer
          Role
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
