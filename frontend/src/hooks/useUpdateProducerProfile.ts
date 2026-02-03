import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProducerProfileApiUsersMeProducerProfilePatch,
  type ProducerProfileUpdate,
  type ProducerProfilePublic,
} from "@/client";

export const producerProfileQueryKey = ["me", "producer-profile"];

export function useUpdateProducerProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    ProducerProfilePublic,
    unknown,
    ProducerProfileUpdate
  >({
    mutationFn: async (payload) => {
      const res =
        await updateProducerProfileApiUsersMeProducerProfilePatch({
          body: payload,
        });

      if (!res.data) {
        throw new Error("Empty response while updating producer profile");
      }

      return res.data;
    },

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        producerProfileQueryKey,
        updatedProfile
      );
    },
  });
}
