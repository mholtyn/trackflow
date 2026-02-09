import { useQuery } from "@tanstack/react-query";
import { listLabelSubmissionsApiWorkspacesWorkspaceIdSubmissionsGet } from "@/client";
import type { SubmissionPublic } from "@/client";

export const labelSubmissionsQueryKey = (workspaceId: string) => [
  "workspaces",
  workspaceId,
  "submissions",
];

export function useLabelSubmissions(workspaceId: string | undefined) {
  return useQuery<SubmissionPublic[]>({
    queryKey: labelSubmissionsQueryKey(workspaceId ?? ""),
    queryFn: async () => {
      if (!workspaceId) return [];
      const res =
        await listLabelSubmissionsApiWorkspacesWorkspaceIdSubmissionsGet({
          path: { workspace_id: workspaceId },
        });
      const list = res.data ?? [];
      return list.filter((s) => s.status !== "WITHDRAWN");
    },
    enabled: Boolean(workspaceId),
  });
}
