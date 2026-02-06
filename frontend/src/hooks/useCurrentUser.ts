import { useQuery } from "@tanstack/react-query";
import { readUserApiMeGet } from "@/client";
import type { UserPublic } from "@/client";

export const currentUserQueryKey = ["me", "user"];

export function useCurrentUser() {
  return useQuery<UserPublic | null>({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const res = await readUserApiMeGet();
      if (res.error) return null;
      return res.data ?? null;
    },
  });
}
