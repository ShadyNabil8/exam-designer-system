import React from "react";
import { useNavigate } from "react-router-dom";

const UpdatePageBtn = ({ updateUrl }) => {
  const navigate = useNavigate();
  const onUpdate = async () => {
    try {
      navigate(updateUrl);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <button
      className="flex h-[40px] w-[100px] items-center justify-center rounded-md bg-green-500 p-1 font-medium text-white"
      onClick={onUpdate}
    >
      Update
    </button>
  );
};

export default UpdatePageBtn;
