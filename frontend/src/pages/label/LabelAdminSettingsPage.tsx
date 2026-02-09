import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useUpdateWorkspace } from "@/hooks/useUpdateWorkspace";
import { useDeleteWorkspace } from "@/hooks/useDeleteWorkspace";
import {
  useAddWorkspaceMember,
  useRemoveWorkspaceMember,
} from "@/hooks/useWorkspaceMemberships";
import type { LabelRole } from "@/client";

const sectionStyle =
  "bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden";
const labelStyle = "font-bold block mb-1 text-sm text-slate-800";
const fieldStyle = "mb-4";

const LABEL_ROLE_OPTIONS: { value: LabelRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "agent", label: "Agent" },
];

export default function LabelAdminSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();
  const updateWorkspace = useUpdateWorkspace(workspaceId);
  const deleteWorkspace = useDeleteWorkspace(workspaceId);
  const addMember = useAddWorkspaceMember(workspaceId);
  const removeMember = useRemoveWorkspaceMember(workspaceId);

  const workspace = workspaces.find((w) => w.id === workspaceId);

  const [name, setName] = useState("");
  const [removeProfileId, setRemoveProfileId] = useState("");
  const [addProfileId, setAddProfileId] = useState("");
  const [addRole, setAddRole] = useState<LabelRole>("agent");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (workspace) setName(workspace.name);
  }, [workspace]);

  const handleSaveName = () => {
    if (!name.trim()) return;
    updateWorkspace.mutate(
      { name: name.trim() },
      { onError: () => {} }
    );
  };

  const handleDeleteWorkspace = () => {
    if (!confirmDelete) return;
    deleteWorkspace.mutate(undefined, {
      onSuccess: () => navigate("/labelstaff/labels"),
      onError: () => {},
    });
  };

  const handleAddMember = () => {
    const id = addProfileId.trim();
    if (!id) return;
    addMember.mutate(
      { labelstaffProfileId: id, role: addRole },
      {
        onSuccess: () => {
          setAddProfileId("");
          setAddRole("agent");
        },
        onError: () => {},
      }
    );
  };

  const handleRemoveMember = () => {
    const id = removeProfileId.trim();
    if (!id) return;
    removeMember.mutate(id, {
      onSuccess: () => setRemoveProfileId(""),
      onError: () => {},
    });
  };

  if (!workspaceId)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-red-600">
        Missing workspace.
      </div>
    );

  if (isLoading)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-slate-500">
        Loading…
      </div>
    );

  if (isError || !workspace)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-red-600">
        Failed to load workspace or access denied.
      </div>
    );

  return (
    <div className="max-w-[720px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-head font-bold">Label admin</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/labelstaff/labels/${workspaceId}`)}
        >
          ← Back to workspace
        </Button>
      </div>

      {/* Workspace name */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Label details
        </h2>
        <div className="p-5">
          <div className={fieldStyle}>
            <label className={labelStyle} htmlFor="workspace-name">
              Label name
            </label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {updateWorkspace.isError && (
            <p className="mb-4 text-red-600 text-sm">
              Failed to save. Please try again.
            </p>
          )}
          {updateWorkspace.isSuccess && (
            <p className="mb-4 text-green-700 text-sm">Saved.</p>
          )}
          <Button
            variant="default"
            size="md"
            onClick={handleSaveName}
            disabled={updateWorkspace.isPending}
          >
            {updateWorkspace.isPending ? "Saving…" : "Save name"}
          </Button>
        </div>
      </section>

      {/* Members: list (placeholder until BE provides GET /workspaces/{id}/memberships) */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Members
        </h2>
        <div className="p-5">
          <p className="text-sm text-slate-600">
            Member list will appear here once the backend exposes a list endpoint (e.g. GET
            /api/workspaces/:workspaceId/memberships). Use Add member / Remove member below in the
            meantime.
          </p>
        </div>
      </section>

      {/* Members: add */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Add member
        </h2>
        <div className="p-5">
          <p className="text-sm text-slate-600 mb-4">
            Add a label staff member by their label staff profile ID (UUID).
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            <div className={fieldStyle}>
              <label className={labelStyle}>Label staff profile ID</label>
              <Input
                placeholder="UUID"
                value={addProfileId}
                onChange={(e) => setAddProfileId(e.target.value)}
                className="min-w-[240px]"
              />
            </div>
            <div className={fieldStyle}>
              <label className={labelStyle}>Role</label>
              <select
                value={addRole}
                onChange={(e) => setAddRole(e.target.value as LabelRole)}
                className="w-full px-4 py-2 rounded border-2 border-black shadow-md focus:outline-none focus:shadow-sm min-w-[120px]"
              >
                {LABEL_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="default"
              size="md"
              onClick={handleAddMember}
              disabled={!addProfileId.trim() || addMember.isPending}
            >
              {addMember.isPending ? "Adding…" : "Add"}
            </Button>
          </div>
          {addMember.isError && (
            <p className="mt-2 text-red-600 text-sm">
              {addMember.error &&
              typeof addMember.error === "object" &&
              "detail" in addMember.error &&
              typeof (addMember.error as { detail: unknown }).detail === "string"
                ? (addMember.error as { detail: string }).detail
                : "Failed to add member. The ID may be wrong (must be a label staff profile UUID), or they may already be a member of this label."}
            </p>
          )}
        </div>
      </section>

      {/* Members: remove */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Remove member
        </h2>
        <div className="p-5">
          <p className="text-sm text-slate-600 mb-4">
            Remove a member by their label staff profile ID.
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            <div className={fieldStyle}>
              <label className={labelStyle}>Label staff profile ID</label>
              <Input
                placeholder="UUID"
                value={removeProfileId}
                onChange={(e) => setRemoveProfileId(e.target.value)}
                className="min-w-[240px]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleRemoveMember}
              disabled={!removeProfileId.trim() || removeMember.isPending}
            >
              {removeMember.isPending ? "Removing…" : "Remove"}
            </Button>
          </div>
          {removeMember.isError && (
            <p className="mt-2 text-red-600 text-sm">
              {removeMember.error &&
              typeof removeMember.error === "object" &&
              "detail" in removeMember.error &&
              typeof (removeMember.error as { detail: unknown }).detail === "string"
                ? (removeMember.error as { detail: string }).detail
                : "Failed to remove member. Check the label staff profile ID and try again."}
            </p>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section className={`${sectionStyle} border-red-300`}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-red-50 px-5 py-3 text-red-800">
          Danger zone
        </h2>
        <div className="p-5">
          <p className="text-sm text-slate-700 mb-4">
            Deleting this label is permanent. All submissions and data for this
            workspace will be removed.
          </p>
          {!confirmDelete ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setConfirmDelete(true)}
              className="border-red-500 text-red-700 hover:bg-red-50"
            >
              I want to delete this label
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="default"
                size="md"
                onClick={handleDeleteWorkspace}
                disabled={deleteWorkspace.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteWorkspace.isPending ? "Deleting…" : "Confirm delete"}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </div>
          )}
          {deleteWorkspace.isError && (
            <p className="mt-2 text-red-600 text-sm">
              Failed to delete. You may not have permission.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
