import { useState } from "react";
import { Button } from "@/components/retroui/Button";

interface SubmissionActionsProps {
  onCreate: (title: string) => void;
}

export function SubmissionActions({ onCreate }: SubmissionActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
  };

  const create = () => {
    if (!newTitle.trim()) return;
    onCreate(newTitle.trim());
    closeModal();
  };

  return (
    <>
      <Button variant="default" size="md" onClick={openModal} style={{ marginBottom: 16 }}>
        Create Submission
      </Button>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{ backgroundColor: "white", padding: 24, borderRadius: 8, minWidth: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create Submission</h2>
            <input
              type="text"
              placeholder="Submission Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 16 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button variant="outline" size="sm" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={create}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}