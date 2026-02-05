import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editTrackApiTracksTrackIdPatch,
  type EditTrackApiTracksTrackIdPatchData,
  type TrackPublic,
} from "@/client";
import { tracksQueryKey } from "./useTracks";

export function useEditTrack() {
  const queryClient = useQueryClient();

  return useMutation<TrackPublic, unknown, EditTrackApiTracksTrackIdPatchData>({
    mutationFn: async (data) => {
      const res = await editTrackApiTracksTrackIdPatch({ ...data, throwOnError: true });
      if (!res.data) throw new Error("Empty response while editing track");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tracksQueryKey });
    },
  });
}
