import { TrackActions } from "./TrackActions";

interface Track {
  id: string;
  title: string;
  tempo: number;
  genre: string[];
  key?: string | null;
}

interface TrackListProps {
  tracks: Track[];
  onEdit: (trackId: string) => void;
  onDelete: (trackId: string) => void;
}

export function TrackList({ tracks, onEdit, onDelete }: TrackListProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "left" }}>Title</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Tempo</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Genre</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Key</th>
          <th style={{ borderBottom: "2px solid black", padding: 8, textAlign: "center" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track) => (
          <tr key={track.id} style={{ borderBottom: "1px solid #ccc" }}>
            <td style={{ padding: 8 }}>{track.title}</td>
            <td style={{ padding: 8, textAlign: "center" }}>{track.tempo}</td>
            <td style={{ padding: 8, textAlign: "center" }}>{track.genre.join(", ")}</td>
            <td style={{ padding: 8, textAlign: "center" }}>{track.key ?? "-"}</td>
            <td style={{ padding: 8, textAlign: "center" }}>
              <TrackActions
                onEdit={() => onEdit(track.id)}
                onDelete={() => onDelete(track.id)}
              />
            </td>
          </tr>
        ))}
        {tracks.length === 0 && (
          <tr>
            <td colSpan={5} style={{ padding: 8, textAlign: "center" }}>
              No tracks found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}