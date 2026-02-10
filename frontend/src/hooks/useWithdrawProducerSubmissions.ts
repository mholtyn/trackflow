import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transitionToWithdrawnApiSubmissionsSubmissionIdWithdrawPost,
  type TransitionToWithdrawnApiSubmissionsSubmissionIdWithdrawPostData,
} from "@/client";
import type { SubmissionPublic } from "@/client";
import { producerSubmissionsQueryKey } from "./useProducerSubmissions";

/**
 * Hook do wycofywania zgłoszenia przez producenta.
 * Wykorzystuje Transition: PENDING -> WITHDRAWN.
 */

export function useWithdrawProducerSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransitionToWithdrawnApiSubmissionsSubmissionIdWithdrawPostData) => {
      const response = await transitionToWithdrawnApiSubmissionsSubmissionIdWithdrawPost({
        ...data,
        throwOnError: true,
      });
      return response.data;
    },

    onMutate: async (variables) => {
      const submissionId = variables.path.submission_id;

      await queryClient.cancelQueries({ queryKey: producerSubmissionsQueryKey });

      const previousSubmissions = queryClient.getQueryData(producerSubmissionsQueryKey);

      queryClient.setQueryData(producerSubmissionsQueryKey, (old: SubmissionPublic[] | undefined) => {
        if (Array.isArray(old)) {
          return old.map((s) =>
            s.id === submissionId ? { ...s, status: "WITHDRAWN" } : s
          );
        }
        return old;
      });

      return { previousSubmissions };
    },

    onError: (err, _variables, context) => {
      if (context?.previousSubmissions) {
        queryClient.setQueryData(producerSubmissionsQueryKey, context.previousSubmissions);
      }
      console.error("Workflow transition failed:", err);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: producerSubmissionsQueryKey });
      queryClient.invalidateQueries({ 
        queryKey: ["submissions", variables.path.submission_id] 
      });
    },
  });
}