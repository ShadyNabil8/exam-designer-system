import React from "react";
import NavigationLink from "./NavigationLink";
import { FiBook } from "react-icons/fi";
import { IoBookmarkOutline } from "react-icons/io5";
import { LuListTodo } from "react-icons/lu";
import { GrAddCircle } from "react-icons/gr";
import { GiOpenBook } from "react-icons/gi";
import { PiExamFill } from "react-icons/pi";

const Navigator = () => {
  return (
    <div className="flex h-full flex-col gap-3 border-r px-2 py-6">
      <div className="flex flex-col gap-1">
        <NavigationLink
          title="Courses"
          url="/courses"
          icon={<FiBook className="text-2xl" />}
        />
        <NavigationLink
          title="Add course"
          url="/add-course"
          icon={<GrAddCircle className="text-2xl" />}
        />
      </div>
      <hr></hr>
      <div className="flex flex-col gap-1">
        <NavigationLink
          title="Chapters"
          url="/chapters"
          icon={<IoBookmarkOutline className="shrink-0 text-2xl" />}
        />
        <NavigationLink
          title="Add chapter"
          url="/add-chapter"
          icon={<GrAddCircle className="shrink-0 text-2xl" />}
        />
      </div>
      <hr></hr>
      <div>
        <NavigationLink
          title="Questions"
          url="/questions"
          icon={<LuListTodo className="shrink-0 text-2xl" />}
        />
        <NavigationLink
          title="Add question"
          url="/add-question"
          icon={<GrAddCircle className="shrink-0 text-2xl" />}
        />
      </div>
      <hr></hr>
      <div>
        <NavigationLink
          title="Generage exam"
          url="/generate-exam"
          icon={<GiOpenBook className="shrink-0 text-2xl" />}
        />
        <NavigationLink
          title="All Exams"
          url="/exams"
          icon={<PiExamFill className="shrink-0 text-2xl" />}
        />
      </div>
    </div>
  );
};

export default Navigator;
