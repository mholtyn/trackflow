import { useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useCreateWorkspace } from "@/hooks/useCreateWorkspace";

const sectionStyle =
  "bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden";
const cardStyle =
  "block w-full text-left px-5 py-4 border-b-2 border-black last:border-b-0 bg-white hover:bg-[#f8f8f8] transition cursor-pointer font-medium";

export default function LabelstaffWorkspaceSelectorPage() {
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const navigate = useNavigate();

  const selectWorkspace = (id: string) => {
    navigate(`/labelstaff/workspace/${id}`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewWorkspaceName("");
  };

  const handleCreateWorkspace = () => {
    const name = newWorkspaceName.trim();
    if (!name) return;
    createWorkspace.mutate(
      { name },
      {
        onSuccess: (created) => {
          closeModal();
          navigate(`/labelstaff/workspace/${created.id}`);
        },
        onError: () => {},
      }
    );
  };

  if (isLoading)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-slate-500">
        Loading workspaces…
      </div>
    );

  if (isError)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-red-600">
        Failed to load workspaces. Please try again.
      </div>
    );

  return (
    <div className="max-w-[720px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-head font-bold">Your Labels</h1>

      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Workspaces
        </h2>
        <div className="divide-y-0">
          {workspaces.length === 0 ? (
            <p className="px-5 py-6 text-slate-600 text-sm">
              No labels yet. Create one to get started.
            </p>
          ) : (
            workspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                className={cardStyle}
                onClick={() => selectWorkspace(ws.id)}
              >
                {ws.name}
              </button>
            ))
          )}
        </div>
        <div className="p-5 border-t-2 border-black bg-[#fafafa]">
          <Button
            variant="default"
            size="md"
            onClick={openModal}
            disabled={createWorkspace.isPending}
          >
            Create new label
          </Button>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 min-w-[300px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-workspace-title"
          >
            <h2
              id="create-workspace-title"
              className="text-lg font-semibold mb-4"
            >
              Create new label
            </h2>
            <label className="font-bold block mb-1 text-sm text-slate-800">
              Label name
            </label>
            <Input
              placeholder="e.g. Awesome Label"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="mb-4"
            />
            {createWorkspace.isError && (
              <p className="mb-4 text-red-600 text-sm">
                Failed to create. Please try again.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName.trim() || createWorkspace.isPending}
              >
                {createWorkspace.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
