import { useState } from "react";
import { useMutation } from "convex/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApiMutation = (mutationFunction: any) => {
  const [isPending, setIsPending] = useState(false);

  const apiMutation = useMutation(mutationFunction);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = (payload: any) => {
    setIsPending(true);

    return apiMutation(payload)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return { isPending, mutation };
};

export default useApiMutation;
