import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import useNotifier from "../hooks/useNotifier";
import api from "../api/api";
import { CgSpinner } from "react-icons/cg";
import useMutateData from "../hooks/useMutateData";

const FloatingDeleteBtn = ({ deleteUrl, queryKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotifier();

  const { mutateAsync } = useMutateData(queryKey, async () => {
    const response = await api.delete(deleteUrl);
    notify(response.data?.message || "Item was succussfully deleted");
  });

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await mutateAsync();
    } catch (error) {
      console.log(error);
      notify.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="rounded-md p-2 transition-colors hover:bg-[#ffcdcd]"
      onClick={onDelete}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-3xl text-rose-600" />
      ) : (
        <MdDelete className="text-3xl text-rose-600" />
      )}
    </button>
  );
};

export default FloatingDeleteBtn;
