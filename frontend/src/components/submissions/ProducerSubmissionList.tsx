import { Button } from "@/components/retroui/Button";
import type { SubmissionPublic } from "@/client";

interface SubmissionListProps {
  submissions: SubmissionPublic[];
  onWithdraw: (id: string) => void;
}

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  WITHDRAWN: "#94a3b8",
  IN_REVIEW: "#0ea5e9",
  SHORTLISTED: "#22c55e",
  ACCEPTED: "#15803d",
  REJECTED: "#dc2626",
};

export function SubmissionList({ submissions, onWithdraw }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          color: "#374151",
          fontSize: "0.9375rem",
          backgroundColor: "#f3f3f3",
          border: "2px solid black",
          boxShadow: "4px 4px 0 0 black",
        }}
      >
        No submissions yet. Create one below to get started.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "2px solid black",
        boxShadow: "4px 4px 0 0 black",
        overflow: "hidden",
      }}
    >
      <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f3f3f3" }}>
            <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
              Title
            </th>
            <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
              Genre
            </th>
            <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              style={{
                borderBottom: "1px solid #ddd",
              }}
            >
              <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                <span style={{ fontWeight: 500, color: "#0f172a" }}>{submission.title}</span>
              </td>
              <td style={{ padding: "16px 20px", color: "#475569", fontSize: "0.9375rem" }}>
                {submission.genre?.length ? submission.genre.join(", ") : "—"}
              </td>
              <td style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: statusColors[submission.status] ?? "#94a3b8",
                      color: "#fff",
                      border: "2px solid black",
                      padding: "4px 10px",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      letterSpacing: "0.02em",
                      boxShadow: "2px 2px 0 0 black",
                    }}
                  >
                    {submission.status.replace("_", " ")}
                  </span>
                  {submission.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => onWithdraw(submission.id)}
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
