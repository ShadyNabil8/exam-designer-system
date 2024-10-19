import React from "react";
import NavigationLink from "./NavigationLink";
import { FiBook } from "react-icons/fi";
import { IoBookmarkOutline } from "react-icons/io5";
import { LuListTodo } from "react-icons/lu";
import { GrAddCircle } from "react-icons/gr";

const Navigator = () => {
  return (
    <div className="flex h-full flex-col gap-3 border-r p-6">
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
          icon={<IoBookmarkOutline className="text-2xl" />}
        />
        <NavigationLink
          title="Add chapter"
          url="/add-chapter"
          icon={<GrAddCircle className="text-2xl" />}
        />
      </div>
      <hr></hr>
      <div>
        <NavigationLink
          title="Question"
          url="/questions"
          icon={<LuListTodo className="text-2xl" />}
        />
        <NavigationLink
          title="Add question"
          url="/add-question"
          icon={<GrAddCircle className="text-2xl" />}
        />
      </div>
    </div>
  );
};

export default Navigator;
