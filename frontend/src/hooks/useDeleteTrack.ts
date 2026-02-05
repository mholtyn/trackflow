import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrackApiTracksTrackIdDelete } from "@/client";
import { tracksQueryKey } from "./useTracks";

export function useDeleteTrack() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (trackId: string) => {
      await deleteTrackApiTracksTrackIdDelete({
        path: { track_id: trackId },
        throwOnError: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tracksQueryKey });
    },
  });
}
