import { useQuery } from "@tanstack/react-query";
import { readLabelstaffProfileApiUsersMeLabelstaffProfileGet } from "@/client";
import type { LabelStaffProfilePublic } from "@/client";
import { labelstaffProfileQueryKey } from "./useUpdateLabelstaffProfile";

export function useLabelstaffProfile() {
  return useQuery<LabelStaffProfilePublic | null>({
    queryKey: labelstaffProfileQueryKey,
    queryFn: async () => {
      const res = await readLabelstaffProfileApiUsersMeLabelstaffProfileGet();
      if (res.error) return null;
      return res.data ?? null;
    },
  });
}
