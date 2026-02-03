import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubmissionApiSubmissionsPost,
  type SubmissionCreate,
  type SubmissionPublic,
} from "@/client";
import { producerSubmissionsQueryKey } from "./useProducerSubmissions";

export function useCreateProducerSubmission() {
  const queryClient = useQueryClient();

  return useMutation<
    SubmissionPublic,
    unknown,
    SubmissionCreate
  >({
    mutationFn: async (payload) => {
      const res = await createSubmissionApiSubmissionsPost({
        body: payload,
      });

      if (!res.data) {
        throw new Error("Empty response while creating submission");
      }

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: producerSubmissionsQueryKey,
      });
    },
  });
}
