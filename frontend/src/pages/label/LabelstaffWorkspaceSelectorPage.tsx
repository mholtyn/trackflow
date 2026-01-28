import { useEffect, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { useNavigate } from "react-router-dom";

interface Workspace {
  id: string;
  name: string;
}

export default function LabelstaffWorkspaceSelectorPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        // TODO: fetch real data from API
        const dummyData: Workspace[] = [
          { id: "1", name: "Awesome Label" },
          { id: "2", name: "Cool Beats" },
        ];
        setWorkspaces(dummyData);
      } catch {
        setError("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkspaces();
  }, []);

  const selectWorkspace = (id: string) => {
    navigate(`/labelstaff/workspace/${id}`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewWorkspaceName("");
  };

  const createWorkspace = () => {
    if (!newWorkspaceName.trim()) return;

    // TODO: call API to create workspace, then refresh list
    const newWs: Workspace = {
      id: Date.now().toString(),
      name: newWorkspaceName.trim(),
    };
    setWorkspaces((prev) => [newWs, ...prev]);
    closeModal();
  };

  if (loading) return <div>Loading workspaces...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Your Labels</h1>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {workspaces.map((ws) => (
          <li
            key={ws.id}
            style={{
              padding: 12,
              marginBottom: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => selectWorkspace(ws.id)}
          >
            {ws.name}
          </li>
        ))}
      </ul>

      <Button variant="default" size="md" onClick={openModal}>
        Create New Label
      </Button>

      {/* Modal */}
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
            <h2>Create New Label</h2>
            <Input
              placeholder="Label Name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button variant="outline" size="sm" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={createWorkspace}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}