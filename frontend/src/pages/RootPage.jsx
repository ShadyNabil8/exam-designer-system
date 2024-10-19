import React from "react";
import Navigator from "../components/Navigator";
import { Outlet } from "react-router-dom";

const RootPage = () => {
  return (
    <div className="flex h-screen w-screen overflow-x-hidden">
      <Navigator />
      <Outlet />
    </div>
  );
};

export default RootPage;
