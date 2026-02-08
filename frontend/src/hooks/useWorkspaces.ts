import { useQuery } from "@tanstack/react-query";
import { listWorkspacesApiWorkspacesGet } from "@/client";
import type { WorkspacePublic } from "@/client";

export const workspacesQueryKey = ["workspaces"];

export function useWorkspaces() {
  return useQuery<WorkspacePublic[]>({
    queryKey: workspacesQueryKey,
    queryFn: async () => {
      const res = await listWorkspacesApiWorkspacesGet();
      return res.data ?? [];
    },
  });
}
