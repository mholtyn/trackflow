import { useState } from "react";
import { SubmissionActions } from "@/components/submissions/SubmissionActions";
import { SubmissionList } from "@/components/submissions/SubmissionList";
import { SubmissionHistory } from "@/components/submissions/SubmissionHistory";

interface Submission {
  id: string;
  title: string;
  status: string;
  date: string;
}

const dummySubmissions: Submission[] = [
  { id: "1", title: "Submission One", status: "Pending", date: "2026-01-20" },
  { id: "2", title: "Submission Two", status: "Approved", date: "2026-01-15" },
];

export default function ProducerSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(dummySubmissions);

  const createSubmission = (title: string) => {
    const newSub: Submission = {
      id: Date.now().toString(),
      title,
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const withdrawSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <h1>Producer Submissions</h1>
      <SubmissionActions onCreate={createSubmission} />
      <SubmissionList submissions={submissions} onWithdraw={withdrawSubmission} />
      <SubmissionHistory />
    </div>
  );
}