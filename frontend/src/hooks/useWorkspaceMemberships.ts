import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdPost,
  deleteMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdDelete,
  type MembershipCreate,
} from "@/client";
import type { MembershipPublic } from "@/client";
import { workspacesQueryKey } from "./useWorkspaces";

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
    },
  });
}

export function useRemoveWorkspaceMember(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelstaffProfileId: string) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      await deleteMemberApiWorkspacesWorkspaceIdMembershipsLabelstaffProfileIdDelete(
        {
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
    },
  });
}
