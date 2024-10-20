import React, { useState } from "react";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

const UpdataBtn = ({ itemTypeName, updateUrl, redirectUrl, updatedData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const notify = useNotifier();
  const navigate = useNavigate();

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(updateUrl, updatedData);
      notify.success(response?.data?.message || `${itemTypeName} updated successfully`);
      if (redirectUrl) {
        navigate(`${redirectUrl}/${response?.data?.data?._id || ""}`);
      }
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
      className="flex h-[40px] max-w-[150px] items-center justify-center rounded-md bg-green-500 p-1 font-medium text-white"
      style={{ pointerEvents: isLoading ? "none" : "" }}
      onClick={onUpdate}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-3xl text-white" />
      ) : (
        `Update ${itemTypeName}`
      )}
    </button>
  );
};

export default UpdataBtn;
