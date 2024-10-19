import React from "react";
import { useNavigate } from "react-router-dom";
import { GrUpdate } from "react-icons/gr";

const FloatingUpdateBtn = ({ updateUrl }) => {
  const navigate = useNavigate();
  const onUpdate = async (e) => {
    try {
      e.preventDefault();
      navigate(updateUrl);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <button
      className="rounded-md p-3 transition-colors hover:bg-[#c2f7b7]"
      onClick={onUpdate}
    >
      <GrUpdate className="text-2xl text-green-500" />
    </button>
  );
};

export default FloatingUpdateBtn;
