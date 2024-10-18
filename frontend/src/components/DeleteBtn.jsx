import React, { useState } from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

const DeleteBtn = ({ deleteUrl, redirectUrl }) => {
  const [isLoading, setIsLoading] = useState(false);

  const notify = useNotifier();
  const navigate = useNavigate();
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await api.delete(deleteUrl);
      notify(response?.data?.message || "Item deleted successfully");
      navigate(redirectUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className="flex h-[40px] w-[100px] items-center justify-center rounded-md bg-red-500 p-1 font-medium text-white"
      style={{ pointerEvents: isLoading ? "none" : "" }}
      onClick={onDelete}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-3xl text-white" />
      ) : (
        "Delete"
      )}
    </button>
  );
};

export default DeleteBtn;
