import { useQueryClient, useMutation } from "@tanstack/react-query";

const useMutateData = (queryKey, mutationFn) => {
  const queryClient = useQueryClient();
  
  const { mutateAsync } = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { mutateAsync };
};

export default useMutateData;
