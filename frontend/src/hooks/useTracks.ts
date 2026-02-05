import { useQuery } from "@tanstack/react-query";
import { listTracksApiTracksGet } from "@/client";
import type { TrackPublic } from "@/client";

export const tracksQueryKey = ["tracks"];

export function useTracks() {
  return useQuery<TrackPublic[]>({
    queryKey: tracksQueryKey,
    queryFn: async () => {
      const res = await listTracksApiTracksGet();
      return res.data ?? [];
    },
  });
}
