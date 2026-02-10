import { useState } from "react";
import { Button } from "@/components/retroui/Button";
import type { TrackPublic, TrackCreate, TrackUpdate } from "@/client";

const inputStyle = {
  width: "100%",
  padding: 8,
  marginBottom: 12,
  border: "2px solid black",
  boxSizing: "border-box" as const,
};

interface TrackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  track?: TrackPublic | null;
  onSubmitCreate: (data: TrackCreate) => void;
  onSubmitEdit: (trackId: string, data: TrackUpdate) => void;
  isPending?: boolean;
}

const emptyForm = {
  title: "",
  streaming_url: "",
  tempo: 0,
  genre: [] as string[],
  key: "" as string | null,
};

function getInitialForm(mode: "add" | "edit", track?: TrackPublic | null) {
  if (mode === "edit" && track) {
    return {
      title: track.title ?? "",
      streaming_url: track.streaming_url ?? "",
      tempo: track.tempo ?? 0,
      genre: track.genre ?? [],
      key: track.key ?? "",
    };
  }
  return emptyForm;
}

function TrackFormModalContent({
  mode,
  track,
  onClose,
  onSubmitCreate,
  onSubmitEdit,
  isPending,
}: {
  mode: "add" | "edit";
  track?: TrackPublic | null;
  onClose: () => void;
  onSubmitCreate: (data: TrackCreate) => void;
  onSubmitEdit: (trackId: string, data: TrackUpdate) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState(() => getInitialForm(mode, track));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.streaming_url.trim() || form.tempo <= 0 || form.genre.length === 0) {
      alert("Please fill title, streaming URL, tempo, and at least one genre.");
      return;
    }
    if (mode === "add") {
      onSubmitCreate({
        title: form.title.trim(),
        streaming_url: form.streaming_url.trim(),
        tempo: form.tempo,
        genre: form.genre,
        key: form.key?.trim() || null,
      });
      onClose();
    } else if (mode === "edit" && track) {
      onSubmitEdit(track.id, {
        title: form.title.trim(),
        streaming_url: form.streaming_url.trim(),
        tempo: form.tempo,
        genre: form.genre,
        key: form.key?.trim() || null,
        extra_metadata: track.extra_metadata ?? null,
      });
      onClose();
    }
  };

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
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.125rem" }}>
            {mode === "add" ? "Add Track" : "Edit Track"}
          </h2>
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isPending}>
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, overflow: "auto", flex: 1 }}>
          <label style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            style={inputStyle}
            required
          />

          <label style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Streaming URL *</label>
          <input
            type="text"
            value={form.streaming_url}
            onChange={(e) => setForm((f) => ({ ...f, streaming_url: e.target.value }))}
            style={inputStyle}
            placeholder="Any string (e.g. SoundCloud link, or dev placeholder)"
            required
          />
          <p style={{ margin: "-8px 0 12px", fontSize: "0.8125rem", color: "#64748b" }}>
            Link where this track can be streamed (e.g. SoundCloud, Spotify, or a direct MP3/audio URL).
          </p>

          <label style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Tempo *</label>
          <input
            type="number"
            min={1}
            value={form.tempo || ""}
            onChange={(e) => setForm((f) => ({ ...f, tempo: Number(e.target.value) || 0 }))}
            style={inputStyle}
            required
          />

          <label style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Genre (comma separated) *</label>
          <input
            type="text"
            value={form.genre.join(", ")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                genre: e.target.value
                  .split(",")
                  .map((g) => g.trim())
                  .filter(Boolean),
              }))
            }
            style={inputStyle}
            placeholder="e.g. Pop, Rock"
          />

          <label style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Key</label>
          <input
            type="text"
            value={form.key ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, key: e.target.value || null }))}
            style={{ ...inputStyle, marginBottom: 20 }}
            placeholder="e.g. Cm"
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit" disabled={isPending}>
              {isPending ? "Saving…" : mode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TrackFormModal({
  isOpen,
  onClose,
  mode,
  track,
  onSubmitCreate,
  onSubmitEdit,
  isPending = false,
}: TrackFormModalProps) {
  if (!isOpen) return null;
  return (
    <TrackFormModalContent
      key={`${mode}-${track?.id ?? "new"}`}
      mode={mode}
      track={track}
      onClose={onClose}
      onSubmitCreate={onSubmitCreate}
      onSubmitEdit={onSubmitEdit}
      isPending={isPending}
    />
  );
}
