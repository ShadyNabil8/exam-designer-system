import React from "react";
import { NavLink } from "react-router-dom";

const NavigationLink = ({ title, icon, url }) => {
  return (
    <NavLink
      to={url}
      className="flex rounded-md px-4 py-2 w-[230px] gap-3  items-center"
      style={({ isActive }) => {
        return {
          backgroundColor: isActive ? "#007AFF" : "",
          color: isActive ? "white" : "#526581",
        };
      }}
    >
      {icon}
      <span className="text-lg font-medium">{title}</span>
    </NavLink>
  );
};

export default NavigationLink;
