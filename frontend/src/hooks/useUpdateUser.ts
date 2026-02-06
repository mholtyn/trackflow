import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApiMePatch } from "@/client";
import type { UserPrivate, UserUpdate } from "@/client";
import { currentUserQueryKey } from "./useCurrentUser";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<UserPrivate, unknown, UserUpdate>({
    mutationFn: async (payload) => {
      const res = await updateUserApiMePatch({ body: payload });
      if (!res.data) throw new Error("Empty response while updating user");
      return res.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(currentUserQueryKey, updatedUser);
    },
  });
}
