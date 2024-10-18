import React from "react";
import Navigator from "../components/Navigator";
import { Outlet } from "react-router-dom";

const RootPage = () => {
  return (
    <div className="w-screen h-screen flex gap-4">
      <Navigator />
      <Outlet />
    </div>
  );
};

export default RootPage;
