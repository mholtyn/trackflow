import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLabelstaffProfileApiUsersMeLabelstaffProfilePatch,
  type LabelStaffProfileUpdate,
  type LabelStaffProfilePublic,
} from "@/client";

export const labelstaffProfileQueryKey = ["me", "labelstaff-profile"];

export function useUpdateLabelstaffProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    LabelStaffProfilePublic,
    unknown,
    LabelStaffProfileUpdate
  >({
    mutationFn: async (payload) => {
      const res =
        await updateLabelstaffProfileApiUsersMeLabelstaffProfilePatch({
          body: payload,
        });

      if (!res.data) {
        throw new Error("Empty response while updating labelstaff profile");
      }

      return res.data;
    },

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        labelstaffProfileQueryKey,
        updatedProfile
      );
    },
  });
}
