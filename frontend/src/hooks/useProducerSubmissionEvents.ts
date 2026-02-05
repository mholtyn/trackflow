import { useQuery } from "@tanstack/react-query";
import { listProducerSubmissionEventsApiSubmissionsEventsGet } from "@/client";
import type { SubmissionEventPublic } from "@/client";

export const producerSubmissionEventsQueryKey = ["producer", "submissions", "events"];

export function useProducerSubmissionEvents(options?: { enabled?: boolean }) {
  return useQuery<SubmissionEventPublic[]>({
    queryKey: producerSubmissionEventsQueryKey,
    queryFn: async () => {
      const res = await listProducerSubmissionEventsApiSubmissionsEventsGet();
      return res.data ?? [];
    },
    enabled: options?.enabled ?? true,
  });
}
