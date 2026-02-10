import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transitionToInReviewApiWorkspacesWorkspaceIdSubmissionsSubmissionIdStartReviewPost,
  transitionToShortlistedApiWorkspacesWorkspaceIdSubmissionsSubmissionIdShortlistPost,
  transitionToAcceptedApiWorkspacesWorkspaceIdSubmissionsSubmissionIdAcceptPost,
  transitionToRejectedApiWorkspacesWorkspaceIdSubmissionsSubmissionIdRejectPost,
} from "@/client";
import type { SubmissionPublic } from "@/client";
import { labelSubmissionsQueryKey } from "./useLabelSubmissions";
import { labelSubmissionEventsQueryKey } from "./useLabelSubmissionEvents";

function useTransition(
  workspaceId: string | undefined,
  transitionFn: (params: {
    path: { workspace_id: string; submission_id: string };
  }) => Promise<{ data?: SubmissionPublic; error?: unknown }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const res = await transitionFn({
        path: { workspace_id: workspaceId, submission_id: submissionId },
      });
      if (res.error) throw new Error(JSON.stringify(res.error));
      if (!res.data) throw new Error("Empty response");
      return res.data;
    },
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: labelSubmissionsQueryKey(workspaceId),
        });
        queryClient.invalidateQueries({
          queryKey: labelSubmissionEventsQueryKey(workspaceId),
        });
      }
    },
  });
}

export function useStartReview(workspaceId: string | undefined) {
  return useTransition(workspaceId, (params) =>
    transitionToInReviewApiWorkspacesWorkspaceIdSubmissionsSubmissionIdStartReviewPost(
      { path: params.path }
    )
  );
}

export function useShortlist(workspaceId: string | undefined) {
  return useTransition(workspaceId, (params) =>
    transitionToShortlistedApiWorkspacesWorkspaceIdSubmissionsSubmissionIdShortlistPost(
      { path: params.path }
    )
  );
}

export function useAccept(workspaceId: string | undefined) {
  return useTransition(workspaceId, (params) =>
    transitionToAcceptedApiWorkspacesWorkspaceIdSubmissionsSubmissionIdAcceptPost(
      { path: params.path }
    )
  );
}

export function useReject(workspaceId: string | undefined) {
  return useTransition(workspaceId, (params) =>
    transitionToRejectedApiWorkspacesWorkspaceIdSubmissionsSubmissionIdRejectPost(
      { path: params.path }
    )
  );
}
