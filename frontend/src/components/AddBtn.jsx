import React, { useState } from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

const AddBtn = ({ itemTypeName, postUrl, redirectUrl, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const notify = useNotifier();
  const navigate = useNavigate();
  const onPost = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(postUrl, data);
      notify(response?.data?.message || `${itemTypeName} added successfully`);
      navigate(`${redirectUrl}/${response?.data?.data?._id || ""}`);
    } catch (error) {
      notify.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors[0]?.msg ||
          "Something sent wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className="flex h-[40px] w-[100px] items-center justify-center rounded-md bg-[#007AFF] p-1 font-medium text-white"
      style={{ pointerEvents: isLoading ? "none" : "" }}
      onClick={onPost}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-3xl text-white" />
      ) : (
        `Add ${itemTypeName}`
      )}
    </button>
  );
};

export default AddBtn;
