import { Button } from "@/components/retroui/Button";

interface Submission {
  id: string;
  title: string;
  status: string;
  date: string;
}

interface SubmissionListProps {
  submissions: Submission[];
  onWithdraw: (id: string) => void;
}

export function SubmissionList({ submissions, onWithdraw }: SubmissionListProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "left" }}>Title</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Status</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Date</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.length === 0 && (
          <tr>
            <td colSpan={4} style={{ padding: 8, textAlign: "center" }}>
              No submissions yet.
            </td>
          </tr>
        )}
        {submissions.map((sub) => (
          <tr key={sub.id} style={{ borderBottom: "1px solid #ccc" }}>
            <td style={{ padding: 8 }}>{sub.title}</td>
            <td style={{ padding: 8, textAlign: "center" }}>{sub.status}</td>
            <td style={{ padding: 8, textAlign: "center" }}>{sub.date}</td>
            <td style={{ padding: 8, textAlign: "center" }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onWithdraw(sub.id)}
              >
                Withdraw
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}