import { useQuery } from "@tanstack/react-query";
import { listProducerSubmissionsApiSubmissionsGet } from "@/client";
import type { SubmissionPublic } from "@/client";

export const producerSubmissionsQueryKey = ["producer", "submissions"];

export function useProducerSubmissions() {
  return useQuery<SubmissionPublic[]>({
    queryKey: producerSubmissionsQueryKey,
    queryFn: async () => {
      const res = await listProducerSubmissionsApiSubmissionsGet();
      return res.data ?? [];
    },
  });
}
