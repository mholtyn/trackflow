import { useState } from "react";
import { Button } from "@/components/retroui/Button";

interface Submission {
  id: string;
  title: string;
  status: string;
}

interface SubmissionEvent {
  id: string;
  status: string;
  eventDate: string;
  actor: string;
}

const dummySubmissions: Submission[] = [
  { id: "1", title: "Track One", status: "PENDING" },
  { id: "2", title: "Track Two", status: "IN_REVIEW" },
];

const dummyEvents: Record<string, SubmissionEvent[]> = {
  "1": [
    { id: "e1", status: "PENDING", eventDate: "2026-01-20", actor: "Producer" },
    { id: "e2", status: "IN_REVIEW", eventDate: "2026-01-21", actor: "Label Staff" },
  ],
  "2": [
    { id: "e3", status: "PENDING", eventDate: "2026-01-18", actor: "Producer" },
  ],
};

export default function LabelWorkspacePage() {
  const [submissions, setSubmissions] = useState(dummySubmissions);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [events, setEvents] = useState<SubmissionEvent[]>([]);

  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId) ?? null;

  const selectSubmission = (id: string) => {
    setSelectedSubmissionId(id);
    setEvents(dummyEvents[id] || []);
  };

  const changeStatus = (newStatus: string) => {
    if (!selectedSubmissionId) return;
    setSubmissions(subs =>
      subs.map(s => (s.id === selectedSubmissionId ? { ...s, status: newStatus } : s))
    );
    // Update events (append new event)
    const newEvent: SubmissionEvent = {
      id: `e${Date.now()}`,
      status: newStatus,
      eventDate: new Date().toISOString().slice(0, 10),
      actor: "Label Staff",
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <div style={{ flex: 1 }}>
        <h2>Submissions</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {submissions.map((s) => (
            <li
              key={s.id}
              onClick={() => selectSubmission(s.id)}
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                border: s.id === selectedSubmissionId ? "2px solid #007acc" : "1px solid #ccc",
                marginBottom: 8,
                borderRadius: 6,
              }}
            >
              <strong>{s.title}</strong> — <em>{s.status}</em>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        {selectedSubmission ? (
          <>
            <h2>Actions for "{selectedSubmission.title}"</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["PENDING", "IN_REVIEW", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((status) => (
                <Button
                  key={status}
                  variant={selectedSubmission.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>

            <h3>History</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {events.length === 0 && <li>No events</li>}
              {events.map((e) => (
                <li key={e.id} style={{ marginBottom: 6 }}>
                  [{e.eventDate}] {e.actor} changed status to <strong>{e.status}</strong>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Select a submission to see actions and history</p>
        )}
      </div>
    </div>
  );
}