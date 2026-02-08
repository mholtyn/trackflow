import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspaceApiWorkspacesPost,
  type WorkspaceCreate,
  type WorkspacePublic,
} from "@/client";
import { workspacesQueryKey } from "./useWorkspaces";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<WorkspacePublic, unknown, WorkspaceCreate>({
    mutationFn: async (payload) => {
      const res = await createWorkspaceApiWorkspacesPost({ body: payload });
      if (!res.data) throw new Error("Empty response while creating workspace");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}
