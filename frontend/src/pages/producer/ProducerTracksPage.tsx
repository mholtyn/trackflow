import { useState } from "react";
import { Button } from "@/components/retroui/Button";
import { TrackList } from "@/components/tracks/TrackList";
import { TrackFormModal } from "@/components/tracks/TrackFormModal";

import { useTracks } from "@/hooks/useTracks";
import { useAddTrack } from "@/hooks/useAddTrack";
import { useEditTrack } from "@/hooks/useEditTrack";
import { useDeleteTrack } from "@/hooks/useDeleteTrack";

import type { TrackPublic, TrackCreate, TrackUpdate } from "@/client";

export default function ProducerTracksPage() {
  const [modalOpen, setModalOpen] = useState<"add" | "edit" | null>(null);
  const [editingTrack, setEditingTrack] = useState<TrackPublic | null>(null);

  const { data: tracks, isLoading, isError } = useTracks();
  const addMutation = useAddTrack();
  const editMutation = useEditTrack();
  const deleteMutation = useDeleteTrack();

  const handleAdd = (data: TrackCreate) => {
    addMutation.mutate(data);
  };

  const handleEdit = (trackId: string, data: TrackUpdate) => {
    editMutation.mutate({ path: { track_id: trackId }, body: data, url: "/api/tracks/{track_id}" });
  };

  const handleDelete = (trackId: string) => {
    if (!confirm("Delete this track?")) return;
    deleteMutation.mutate(trackId);
  };

  const openEdit = (track: TrackPublic) => {
    setEditingTrack(track);
    setModalOpen("edit");
  };

  const closeModal = () => {
    setModalOpen(null);
    setEditingTrack(null);
  };

  if (isLoading) return <div style={{ color: "#64748b", padding: 24 }}>Loading…</div>;
  if (isError) return <div style={{ color: "#dc2626", padding: 24 }}>Failed to load tracks.</div>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <TrackList
        tracks={tracks ?? []}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="default" size="md" type="button" onClick={() => setModalOpen("add")}>
          Add Track
        </Button>
      </div>

      <TrackFormModal
        isOpen={modalOpen !== null}
        onClose={closeModal}
        mode={modalOpen === "edit" ? "edit" : "add"}
        track={modalOpen === "edit" ? editingTrack : null}
        onSubmitCreate={handleAdd}
        onSubmitEdit={handleEdit}
        isPending={addMutation.isPending || editMutation.isPending}
      />
    </div>
  );
}
