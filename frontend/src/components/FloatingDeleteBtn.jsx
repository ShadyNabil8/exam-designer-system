import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import useNotifier from "../hooks/useNotifier";
import api from "../api/api";
import { CgSpinner } from "react-icons/cg";
import useMutateData from "../hooks/useMutateData";

const FloatingDeleteBtn = ({ deleteUrl, queryKey }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotifier();

  const { mutateAsync } = useMutateData(queryKey, async () => {
    const response = await api.delete(deleteUrl);
    notify.success(response.data?.message || "Item was succussfully deleted");
  });

  const onDelete = async (e) => {
    e.preventDefault();
    // try {
    //   setIsLoading(true);
    //   await mutateAsync();
    // } catch (error) {
    //   console.log(error);
    //   notify.error(error.response?.data?.message || "Something went wrong!");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <button
      className="relative rounded-md p-2 transition-colors hover:bg-[#ffcdcd]"
      onClick={onDelete}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute -left-2 top-1/2 w-[200px] -translate-x-full -translate-y-1/2 rounded-md bg-rose-600 p-2 text-white">
          Delete feature is disabled to keep the dummy data!
        </div>
      )}
      {isLoading ? (
        <CgSpinner className="animate-spin text-3xl text-rose-600" />
      ) : (
        <MdDelete className="text-3xl text-rose-600" />
      )}
    </button>
  );
};

export default FloatingDeleteBtn;
