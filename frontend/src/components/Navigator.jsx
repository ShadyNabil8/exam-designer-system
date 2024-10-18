import React from "react";
import NavigationLink from "./NavigationLink";
import { FiBook } from "react-icons/fi";
import { IoBookmarkOutline } from "react-icons/io5";
import { LuListTodo } from "react-icons/lu";

const Navigator = () => {
  return (
    <div className="h-full border-r p-6 flex flex-col gap-2">
      <NavigationLink
        title="Courses"
        url="/courses"
        icon={<FiBook className="text-2xl " />}
      />
      <NavigationLink
        title="Chapters"
        url="/chapters"
        icon={<IoBookmarkOutline className="text-2xl " />}
      />
      <NavigationLink
        title="Question"
        url="/questions"
        icon={<LuListTodo className="text-2xl " />}
      />
    </div>
  );
};

export default Navigator;
