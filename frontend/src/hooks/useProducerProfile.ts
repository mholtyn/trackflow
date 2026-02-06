import { useQuery } from "@tanstack/react-query";
import { readProducerProfileApiUsersMeProducerProfileGet } from "@/client";
import type { ProducerProfilePublic } from "@/client";
import { producerProfileQueryKey } from "./useUpdateProducerProfile";

export function useProducerProfile() {
  return useQuery<ProducerProfilePublic | null>({
    queryKey: producerProfileQueryKey,
    queryFn: async () => {
      const res = await readProducerProfileApiUsersMeProducerProfileGet();
      if (res.error) return null;
      return res.data ?? null;
    },
  });
}
