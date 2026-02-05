import { useState } from "react";
import { Button } from "@/components/retroui/Button";
import { SubmissionActions } from "@/components/submissions/ProducerSubmissionActions";
import { SubmissionList } from "@/components/submissions/ProducerSubmissionList";
import { ProducerSubmissionHistory } from "@/components/submissions/ProducerSubmissionHistory";

import { useCreateProducerSubmission } from "@/hooks/useCreateProducerSubmission";
import { useProducerSubmissions } from "@/hooks/useProducerSubmissions";
import { useWithdrawProducerSubmission } from "@/hooks/useWithdrawProducerSubmissions";

import type { SubmissionCreate } from "@/client";

export default function ProducerSubmissionsPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { data: submissions, isLoading, isError } = useProducerSubmissions();
  const createMutation = useCreateProducerSubmission();
  const withdrawMutation = useWithdrawProducerSubmission();

  const handleCreate = (submission: SubmissionCreate) => {
    createMutation.mutate(submission);
  };

  const handleWithdraw = (id: string) => {
    withdrawMutation.mutate({
      path: { submission_id: id },
      url: "/api/submissions/{submission_id}/withdraw",
    });
  };

  if (isLoading) return <div style={{ color: "#64748b", padding: 24 }}>Loading…</div>;
  if (isError) return <div style={{ color: "#dc2626", padding: 24 }}>Failed to load submissions.</div>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <SubmissionList submissions={submissions ?? []} onWithdraw={handleWithdraw} />
      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <SubmissionActions onCreate={handleCreate} />
        <Button variant="outline" size="md" type="button" onClick={() => setHistoryOpen(true)}>
          Submissions History
        </Button>
      </div>
      <ProducerSubmissionHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}
