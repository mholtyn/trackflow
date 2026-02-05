import { TrackActions } from "./TrackActions";
import type { TrackPublic } from "@/client";

interface TrackListProps {
  tracks: TrackPublic[];
  onEdit: (track: TrackPublic) => void;
  onDelete: (trackId: string) => void;
}

export function TrackList({ tracks, onEdit, onDelete }: TrackListProps) {
  if (tracks.length === 0) {
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
        No tracks yet. Add one below to get started.
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
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%", minWidth: 140 }} />
        </colgroup>
        <thead>
          <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f3f3f3" }}>
            <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
              Title
            </th>
            <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
              Streaming URL
            </th>
            <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, fontSize: "0.8125rem" }}>
              Tempo
            </th>
            <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.8125rem" }}>
              Genre
            </th>
            <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, fontSize: "0.8125rem" }}>
              Key
            </th>
            <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, fontSize: "0.8125rem", minWidth: 140 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr key={track.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "16px 20px", fontWeight: 500, color: "#0f172a" }}>{track.title}</td>
              <td style={{ padding: "16px 20px", color: "#475569", fontSize: "0.875rem", wordBreak: "break-all" }}>
                {track.streaming_url || "—"}
              </td>
              <td style={{ padding: "16px 20px", textAlign: "center", color: "#475569" }}>{track.tempo}</td>
              <td style={{ padding: "16px 20px", color: "#475569", fontSize: "0.9375rem" }}>
                {track.genre?.length ? track.genre.join(", ") : "—"}
              </td>
              <td style={{ padding: "16px 20px", textAlign: "center", color: "#475569" }}>
                {track.key ?? "—"}
              </td>
              <td style={{ padding: "16px 20px", textAlign: "center" }}>
                <TrackActions
                  onEdit={() => onEdit(track)}
                  onDelete={() => onDelete(track.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
