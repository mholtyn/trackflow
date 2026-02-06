import { useQuery } from "@tanstack/react-query";
import { readUserApiMeGet } from "@/client";
import type { UserPrivate } from "@/client";

export const currentUserQueryKey = ["me", "user"];

export function useCurrentUser() {
  return useQuery<UserPrivate | null>({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const res = await readUserApiMeGet();
      if (res.error) return null;
      return res.data ?? null;
    },
  });
}
