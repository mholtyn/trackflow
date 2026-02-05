import { Button } from "@/components/retroui/Button";
import { useProducerSubmissionEvents } from "@/hooks/useProducerSubmissionEvents";
import type { SubmissionEventPublic } from "@/client";

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  WITHDRAWN: "#94a3b8",
  IN_REVIEW: "#0ea5e9",
  SHORTLISTED: "#22c55e",
  ACCEPTED: "#15803d",
  REJECTED: "#dc2626",
};

function formatEventDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

interface ProducerSubmissionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProducerSubmissionHistory({ isOpen, onClose }: ProducerSubmissionHistoryProps) {
  const { data: events, isLoading, isError } = useProducerSubmissionEvents({ enabled: isOpen });

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          border: "2px solid black",
          boxShadow: "6px 6px 0 0 black",
          maxWidth: 560,
          width: "90%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "2px solid black",
            backgroundColor: "#f3f3f3",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.125rem" }}>Submissions History</h2>
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Close
          </Button>
        </div>

        <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
          {isLoading && (
            <p style={{ margin: 0, color: "#64748b" }}>Loading events…</p>
          )}
          {isError && (
            <p style={{ margin: 0, color: "#dc2626" }}>Failed to load submission events.</p>
          )}
          {!isLoading && !isError && events && events.length === 0 && (
            <p style={{ margin: 0, color: "#64748b" }}>No submission events yet.</p>
          )}
          {!isLoading && !isError && events && events.length > 0 && (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid black" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
                    Date
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
                    Status
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
                    Submission
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...events]
                  .sort(
                    (a: SubmissionEventPublic, b: SubmissionEventPublic) =>
                      new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
                  )
                  .map((event) => (
                    <tr key={event.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "12px", fontSize: "0.875rem" }}>
                        {formatEventDate(event.event_date)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: statusColors[event.status] ?? "#94a3b8",
                            color: "#fff",
                            border: "2px solid black",
                            padding: "2px 8px",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            boxShadow: "2px 2px 0 0 black",
                          }}
                        >
                          {event.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.875rem", color: "#475569" }}>
                        {event.submission_id.slice(0, 8)}…
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
