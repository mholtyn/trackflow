import { useState } from "react";
import { Button } from "@/components/retroui/Button";
import type { SubmissionCreate } from "@/client";

interface SubmissionActionsProps {
  onCreate: (submission: SubmissionCreate) => void;
}

export function SubmissionActions({ onCreate }: SubmissionActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionCreate>({
    workspace_id: "",
    title: "",
    streaming_url: "",
    tempo: 0,
    genre: null,
    key: null,
    extra_metadata: null,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSubmissionData({
      workspace_id: "",
      title: "",
      streaming_url: "",
      tempo: 0,
      genre: null,
      key: null,
      extra_metadata: null,
    });
  };

  const handleChange = (field: keyof SubmissionCreate, value: unknown) => {
    setSubmissionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const create = () => {
    if (
      !submissionData.title.trim() ||
      !submissionData.workspace_id.trim() ||
      !submissionData.streaming_url.trim() ||
      submissionData.tempo <= 0
    ) {
      alert("Please fill all required fields correctly.");
      return;
    }
    onCreate(submissionData);
    closeModal();
  };

  return (
    <>
      <Button variant="default" size="md" onClick={openModal}>
        New submission
      </Button>

      {isModalOpen && (
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
          onClick={closeModal}
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
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.125rem" }}>Create Submission</h2>
              <Button variant="outline" size="sm" type="button" onClick={closeModal}>
                Close
              </Button>
            </div>

            <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
              <input
                type="text"
                placeholder="Workspace ID *"
                value={submissionData.workspace_id}
                onChange={(e) => handleChange("workspace_id", e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 12, border: "2px solid black", boxSizing: "border-box" }}
              />

              <input
                type="text"
                placeholder="Title *"
                value={submissionData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 12, border: "2px solid black", boxSizing: "border-box" }}
              />

              <input
                type="text"
                placeholder="Streaming URL *"
                value={submissionData.streaming_url}
                onChange={(e) => handleChange("streaming_url", e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 12, border: "2px solid black", boxSizing: "border-box" }}
              />

              <input
                type="number"
                placeholder="Tempo *"
                value={submissionData.tempo || ""}
                onChange={(e) => handleChange("tempo", Number(e.target.value))}
                style={{ width: "100%", padding: 8, marginBottom: 12, border: "2px solid black", boxSizing: "border-box" }}
                min={1}
              />

              <input
                type="text"
                placeholder="Genre (comma separated)"
                value={submissionData.genre?.join(", ") || ""}
                onChange={(e) =>
                  handleChange(
                    "genre",
                    e.target.value
                      .split(",")
                      .map((g) => g.trim())
                      .filter(Boolean)
                  )
                }
                style={{ width: "100%", padding: 8, marginBottom: 12, border: "2px solid black", boxSizing: "border-box" }}
              />

              <input
                type="text"
                placeholder="Key"
                value={submissionData.key || ""}
                onChange={(e) => handleChange("key", e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 20, border: "2px solid black", boxSizing: "border-box" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="outline" size="sm" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" type="button" onClick={create}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
