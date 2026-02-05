import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTrackApiTracksPost, type TrackCreate, type TrackPublic } from "@/client";
import { tracksQueryKey } from "./useTracks";

export function useAddTrack() {
  const queryClient = useQueryClient();

  return useMutation<TrackPublic, unknown, TrackCreate>({
    mutationFn: async (payload) => {
      const res = await addTrackApiTracksPost({ body: payload });
      if (!res.data) throw new Error("Empty response while adding track");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tracksQueryKey });
    },
  });
}
