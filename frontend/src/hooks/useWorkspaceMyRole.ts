import { useQuery } from "@tanstack/react-query";
import { getMyMembershipApiWorkspacesWorkspaceIdMembershipsMeGet } from "@/client";
import type { MemebershipMe } from "@/client";

export const workspaceMyRoleQueryKey = (workspaceId: string) => [
  "workspaces",
  workspaceId,
  "memberships",
  "me",
];

export function useWorkspaceMyRole(workspaceId: string | undefined) {
  return useQuery<MemebershipMe | null>({
    queryKey: workspaceMyRoleQueryKey(workspaceId ?? ""),
    queryFn: async () => {
      if (!workspaceId) return null;
      const res = await getMyMembershipApiWorkspacesWorkspaceIdMembershipsMeGet({
        path: { workspace_id: workspaceId },
      });
      if (res.error) return null;
      return res.data ?? null;
    },
    enabled: Boolean(workspaceId),
  });
}
