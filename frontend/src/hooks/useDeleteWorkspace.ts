import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspaceApiWorkspacesWorkspaceIdDelete } from "@/client";
import { workspacesQueryKey } from "./useWorkspaces";

export function useDeleteWorkspace(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!workspaceId) throw new Error("Workspace ID required");
      await deleteWorkspaceApiWorkspacesWorkspaceIdDelete({
        path: { workspace_id: workspaceId },
        throwOnError: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}
