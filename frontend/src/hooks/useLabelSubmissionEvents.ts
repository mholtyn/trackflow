import { useQuery } from "@tanstack/react-query";
import { listLabelSubmissionEventsApiWorkspacesWorkspaceIdSubmissionsEventsGet } from "@/client";
import type { SubmissionEventPublic } from "@/client";

export const labelSubmissionEventsQueryKey = (workspaceId: string) => [
  "workspaces",
  workspaceId,
  "submissions",
  "events",
];

export function useLabelSubmissionEvents(workspaceId: string | undefined) {
  return useQuery<SubmissionEventPublic[]>({
    queryKey: labelSubmissionEventsQueryKey(workspaceId ?? ""),
    queryFn: async () => {
      if (!workspaceId) return [];
      const res =
        await listLabelSubmissionEventsApiWorkspacesWorkspaceIdSubmissionsEventsGet(
          { path: { workspace_id: workspaceId } }
        );
      return res.data ?? [];
    },
    enabled: Boolean(workspaceId),
  });
}
