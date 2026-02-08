import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateWorkspaceApiWorkspacesWorkspaceIdPatch,
  type WorkspaceUpdate,
  type WorkspacePublic,
} from "@/client";
import { workspacesQueryKey } from "./useWorkspaces";

export function useUpdateWorkspace(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<WorkspacePublic, unknown, WorkspaceUpdate>({
    mutationFn: async (body) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const res = await updateWorkspaceApiWorkspacesWorkspaceIdPatch({
        path: { workspace_id: workspaceId },
        body,
        throwOnError: true,
      });
      if (!res.data) throw new Error("Empty response");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}
