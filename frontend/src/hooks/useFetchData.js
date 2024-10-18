import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useNotifier from "./useNotifier";

const useFetchData = (queryKey, queryFn) => {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn });
  const notify = useNotifier();

  useEffect(() => {
    if (!isLoading && error) {
      notify.error(error?.message || "Something went wrong!");
    }
  }, [isLoading, error, data]);

  return { data, isLoading, error };
};

export default useFetchData;
