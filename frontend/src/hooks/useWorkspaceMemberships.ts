import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdPost,
  deleteMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdDelete,
  listMembershipsApiWorkspacesWorkspaceIdMembershipsGet,
  type MembershipCreate,
} from "@/client";
import type { MembershipPublic } from "@/client";
import { workspacesQueryKey } from "./useWorkspaces";

export const workspaceMembershipsQueryKey = (workspaceId: string) => [
  "workspaces",
  workspaceId,
  "memberships",
];

export function useWorkspaceMembershipsList(workspaceId: string | undefined) {
  return useQuery<MembershipPublic[]>({
    queryKey: workspaceMembershipsQueryKey(workspaceId ?? ""),
    queryFn: async () => {
      if (!workspaceId) return [];
      const res = await listMembershipsApiWorkspacesWorkspaceIdMembershipsGet({
        path: { workspace_id: workspaceId },
      });
      return res.data ?? [];
    },
    enabled: Boolean(workspaceId),
  });
}

export function useAddWorkspaceMember(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<
    MembershipPublic,
    unknown,
    { labelstaffProfileId: string; role: MembershipCreate["role"] }
  >({
    mutationFn: async ({ labelstaffProfileId, role }) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const res =
        await addMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdPost(
          {
            path: { workspace_id: workspaceId, labelstaff_profile_id: labelstaffProfileId },
            body: { role },
            throwOnError: true,
          }
        );
      if (!res.data) throw new Error("Empty response");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: workspaceMembershipsQueryKey(workspaceId),
        });
      }
    },
  });
}

export function useRemoveWorkspaceMember(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelstaffProfileId: string) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      // Build URL explicitly so DELETE is sent to the correct endpoint (path substitution can fail with some client configs)
      const url = `/api/workspaces/${workspaceId}/memberships/${labelstaffProfileId}`;
      await deleteMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdDelete(
        {
          url,
          path: {
            workspace_id: workspaceId,
            labelstaff_profile_id: labelstaffProfileId,
          },
          throwOnError: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: workspaceMembershipsQueryKey(workspaceId),
        });
      }
    },
  });
}
